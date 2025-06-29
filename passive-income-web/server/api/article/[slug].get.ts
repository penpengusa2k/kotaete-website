// server/api/article/[slug].get.ts
import { Client } from '@notionhq/client';
import { defineEventHandler, createError } from 'h3';

// NotionToMarkdown をサーバーサイドでインポート
import { NotionToMarkdown } from 'notion-to-md';
// MarkdownをHTMLに変換するユーティリティ (既存のutils/markdown.jsを想定)
import { compileMarkdown } from '~/utils/markdown'; 

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const notion = new Client({ auth: config.notionSecret });
  const n2m = new NotionToMarkdown({ notionClient: notion }); // ここで初期化

  const slug = getRouterParam(event, 'slug');
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
            property: 'Slug',
            rich_text: {
              equals: slug,
            },
          },
          {
            property: 'Published',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      page_size: 1,
    });

    if (queryResponse.results.length === 0) {
      throw createError({ statusCode: 404, statusMessage: 'Article not found.' });
    }

    const page = queryResponse.results[0] as any;
    const pageId = page.id;

    // 2. 記事の本文コンテンツ (ブロック) を全て取得する (100件超え対応)
    let allBlocks = [];
    let cursor: string | undefined = undefined;

    do {
      const blocksResponse: any = await notion.blocks.children.list({ // 型アサーションを追加
        block_id: pageId,
        page_size: 100, // 最大サイズ
        start_cursor: cursor,
      });
      allBlocks = allBlocks.concat(blocksResponse.results);
      cursor = blocksResponse.next_cursor || undefined;
    } while (cursor);

    // 3. NotionブロックをMarkdownに変換
    const mdblocks = await n2m.blocksToMarkdown(allBlocks);
    const mdString = n2m.toMarkdownString(mdblocks);

    // 4. MarkdownをHTMLに変換
    // compileMarkdown 関数が非同期である場合は await を使用
    // mdString.parent は NotionToMarkdown の toMarkdownString が返すオブジェクトのプロパティ
    const renderedHtmlContent = await compileMarkdown(mdString.parent);


    // 5. 記事のプロパティを抽出し、本文HTMLと合わせて返す
    const properties = page.properties;
    const articleData = {
      id: pageId,
      title: properties.Name?.title?.[0]?.plain_text || '無題の記事',
      slug: properties.Slug?.rich_text?.[0]?.plain_text || null,
      published: properties.Published?.checkbox || false,
      date: properties.Date?.date?.start || null,
      category: properties.Category?.multi_select // 堅牢化
        ? properties.Category.multi_select.map((cat: any) => cat.name)
        : ['未分類'],
      // 画像URLの堅牢化 (filesタイプとurlタイプ両方に対応)
      image: properties.Image?.files?.[0]?.file?.url || properties.Image?.files?.[0]?.external?.url || properties.Image?.url || 'https://via.placeholder.com/800x450/E0F2F7/2C3E50?text=No+Image',
      // contentBlocks はもうフロントエンドに送る必要がない (renderedHtmlContent を送るため)
      // contentBlocks: allBlocks, 
      renderedHtmlContent: renderedHtmlContent, // 変換済みのHTMLを返す
    };

    return articleData;

  } catch (error: any) {
    console.error('Error fetching single article from Notion:', error.body || error.message);
    const statusMessage = `Failed to fetch article: ${error.body?.code || 'unknown_error'}`;
    throw createError({ statusCode: error.status || 500, statusMessage: statusMessage });
  }
});
