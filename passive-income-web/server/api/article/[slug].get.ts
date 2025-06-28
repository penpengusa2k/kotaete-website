// server/api/article/[slug].get.ts
import { Client } from '@notionhq/client';
// NotionブロックをMarkdownに変換するライブラリを後でインストールします
// import { NotionToMarkdown } from 'notion-to-md'; // 後でインストール

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const notion = new Client({ auth: config.notionSecret });

  const slug = getRouterParam(event, 'slug'); // URLからslugを取得
  const databaseId = config.notionArticlesDatabaseId;

  if (!slug || !databaseId || !config.notionSecret) {
    console.error('Missing slug, database ID, or Notion secret.');
    throw createError({ statusCode: 400, statusMessage: 'Bad Request: Missing parameters.' });
  }

  try {
    // 1. スラッグからNotionのページIDを特定する
    const queryResponse = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Slug', // Notionデータベースの「Slug」プロパティ
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Published', // 公開済みの記事のみ
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      page_size: 1, // 該当する記事は1つだけのはず
    });

    if (queryResponse.results.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Article not found.' });
    }

    const page = queryResponse.results[0] as any; // 該当記事のページオブジェクト
    const pageId = page.id; // 記事のページID

    // 2. 記事の本文コンテンツ (ブロック) を取得する
    const blocksResponse = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100, // 記事のブロック数を考慮して調整
    });

    // 3. 記事のプロパティを抽出し、本文ブロックと合わせて返す
    const properties = page.properties;
    const articleData = {
      id: pageId,
      title: properties.Name?.title?.[0]?.plain_text || '無題の記事',
      slug: properties.Slug?.rich_text?.[0]?.plain_text || null,
      published: properties.Published?.checkbox || false,
      date: properties.Date?.date?.start || null,
      category: properties.Category.type === 'multi_select'
        ? properties.Category.multi_select.map((cat: any) => cat.name)
        : ['未分類'],
      //category: properties.Category.select?.name || '未分類',
      description: properties.Description?.rich_text?.[0]?.plain_text || '記事の概要がありません。',
      image: properties.Image?.url || 'https://via.placeholder.com/800x450/E0F2F7/2C3E50?text=No+Image',
      contentBlocks: blocksResponse.results, // Notionの生のブロックデータ
    };

    return articleData;

  } catch (error: any) {
    console.error('Error fetching single article from Notion:', error.body || error.message);
    // Notion APIのエラーコードに基づいてより詳細なエラーを返す
    const statusMessage = `Failed to fetch article: ${error.body?.code || 'unknown_error'}`;
    throw createError({ statusCode: error.status || 500, statusMessage: statusMessage });
  }
});
