// server/api/articles.get.ts
import { Client } from '@notionhq/client';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(); // nuxt.config.ts で定義した runtimeConfig を取得

  // Notion APIクライアントの初期化 (APIキーを渡す)
  const notion = new Client({ auth: config.notionSecret });
  const databaseId = config.notionArticlesDatabaseId; // データベースIDを取得

  // 環境変数が設定されていない場合はエラーを返す
  if (!databaseId || !config.notionSecret) {
    console.error('Notion API keys or database ID are not set in runtimeConfig.');
    throw createError({ statusCode: 500, statusMessage: 'Server configuration error: Notion API keys are missing.' });
  }

  try {
    // Notionデータベースから記事をクエリ (取得) する
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published', // Notionデータベースの「Published」プロパティ
        checkbox: {
          equals: true, // チェックボックスがTrue (公開) の記事のみ取得
        },
      },
      sorts: [
        {
          property: 'Date', // Notionデータベースの「Date」プロパティ
          direction: 'descending', // 日付の新しい順
        },
      ],
    });

    // 取得したNotionのページデータから、必要なプロパティを抽出して加工する
    const articles = response.results.map((page: any) => {
      const properties = page.properties;
      return {
        id: page.id,
        title: properties.Name?.title?.[0]?.plain_text || '無題の記事',
        slug: properties.Slug?.rich_text?.[0]?.plain_text || null,
        published: properties.Published?.checkbox || false,
        date: properties.Date?.date?.start || null,
        category: properties.Category.type === 'multi_select'
          ? properties.Category.multi_select.map((cat: any) => cat.name)
          : ['未分類'],
        //category: properties.Category.select?.name || '未分類',
        description: properties.Description?.rich_text?.[0]?.plain_text || '記事の概要がありません。',
        image: properties.Image?.url || 'https://via.placeholder.com/400x250/E0F2F7/2C3E50?text=No+Image',
      };
    }).filter(article => article.slug && article.published); // slugがないか、PublishedがFalseのものは除外

    return articles; // 処理済みの記事データをフロントエンドに返す
  } catch (error: any) {
    console.error('Error fetching articles from Notion:', error.body || error.message);
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch articles from Notion: ${error.body?.code || 'unknown_error'}` });
  }
});
