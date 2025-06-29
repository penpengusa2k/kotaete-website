// server/api/articles.get.ts
import { Client } from '@notionhq/client';
import { defineEventHandler, createError } from 'h3'; // defineEventHandler, createError は h3 からインポート

// ★ useRuntimeConfig のインポート文を削除する ★
// import { useRuntimeConfig } from '#app'; // この行を削除します

export default defineEventHandler(async (event) => {
  // useRuntimeConfig はインポートなしで直接呼び出します
  const config = useRuntimeConfig(); // Nuxt 3 のサーバーAPIルートではグローバルに利用可能

  const notion = new Client({ auth: config.notionSecret });
  const databaseId = config.notionArticlesDatabaseId;

  if (!databaseId || !config.notionSecret) {
    console.error('Notion API keys or database ID are not set in runtimeConfig.');
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error: Notion API keys are missing.' });
  }

  let allResults: any[] = [];
  let cursor: string | undefined = undefined;

  try {
    do {
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
        page_size: 100,
        start_cursor: cursor,
      });

      allResults = allResults.concat(response.results);
      cursor = response.next_cursor || undefined;

    } while (cursor);

    const articles = allResults.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Name?.title?.[0]?.plain_text || '無題の記事',
        slug: properties.Slug?.rich_text?.[0]?.plain_text || null,
        published: properties.Published?.checkbox || false,
        date: properties.Date?.date?.start || null,
        category: properties.Category?.multi_select
          ? properties.Category.multi_select.map((cat: any) => cat.name)
          : ['未分類'],
        description: properties.Description?.rich_text?.[0]?.plain_text || '記事の概要がありません。',
        image: properties.Image?.files?.[0]?.file?.url || properties.Image?.files?.[0]?.external?.url || properties.Image?.url || 'https://via.placeholder.com/400x250/E0F2F7/2C3E50?text=No+Image',
      };
    }).filter(article => article.slug && article.published);

    return articles;
  } catch (error: any) {
    console.error('Error fetching articles from Notion:', error.body || error.message);
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch articles from Notion: ${error.body?.code || 'unknown_error'}` });
  }
});
