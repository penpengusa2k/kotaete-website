// ~/utils/markdown.ts
import { marked } from 'marked';
import DOMPurify from 'dompurify'; // サニタイズのためにインストール推奨

// SSR時にDOMPurifyがエラーにならないように、グローバルオブジェクトを確認
// Nuxt 3では process.client での判断が推奨されます
// if (process.server) {
//   // globalThis.DOMPurify = { sanitize: (html: string) => html } as any; // これが原因でエラーになった場合はコメントアウトするか、別の対応
// }

// markedの非同期処理に対応するためにasync関数にする
export async function compileMarkdown(markdownString: string): Promise<string> { // Promise<string> を返す型に
  // MarkdownをHTMLに変換
  const html = await marked.parse(markdownString); // await を追加

  // XSS対策としてHTMLをサニタイズ (ブラウザ環境でのみ動作)
  if (process.client) {
    return DOMPurify.sanitize(html);
  } else {
    // サーバーサイドではサニタイズせずそのまま返すか、別のサニタイズライブラリを使用
    // SSR時のDOMPurifyのエラーを避けるため、ここではそのまま返す
    return html;
  }
}
