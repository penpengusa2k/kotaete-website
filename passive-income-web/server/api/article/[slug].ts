// このファイルはNotion API連携時に実装されます。
// 現時点ではダミーまたはプレースホルダーです。
export default defineEventHandler(async (event) => {
  console.log('[server/api/articles] Fetching articles...');
  // ここにNotionデータベースから記事一覧を取得するロジックを実装します
  // 例: const notionClient = new Client({ auth: process.env.NOTION_API_KEY });
  // const response = await notionClient.databases.query({ database_id: 'YOUR_DATABASE_ID' });
  return {
    articles: [
      { id: '1', title: 'ダミー記事1', date: '2025-06-28' },
      { id: '2', title: 'ダミー記事2', date: '2025-06-27' },
    ]
  };
});
