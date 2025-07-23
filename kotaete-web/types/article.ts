// Notion APIから取得する記事データの型定義の例
export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  // Notion APIのレスポンスに応じて、さらにプロパティを追加
  notionBlocks?: any[]; // Notionのブロックオブジェクト
}

// Notion APIから取得するプロパティの型定義の例 (より詳細な場合)
export interface NotionProperty {
  id: string;
  type: string;
  title?: { title: Array<{ plain_text: string }> }[];
  rich_text?: { rich_text: Array<{ plain_text: string }> }[];
  date?: { date: { start: string } };
  multi_select?: { multi_select: Array<{ name: string }> }[];
  files?: { files: Array<{ file: { url: string } }> }[];
  // ... その他Notionのプロパティタイプ
}
