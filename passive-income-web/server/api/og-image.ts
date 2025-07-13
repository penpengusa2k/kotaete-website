import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { html } from 'satori-html';

// ストレージからフォントを読み込む
// パフォーマンスのため、一度読み込んだデータはキャッシュする
let fontBuffer: ArrayBuffer | null = null;

async function getFontData() {
  if (!fontBuffer) {
    const fontAsset = await useStorage('assets:server').getItem('NotoSansJP-Bold.woff2', { encoding: 'binary' });
    if (!fontAsset) {
      throw new Error('Font not found');
    }
    fontBuffer = fontAsset as ArrayBuffer;
  }
  return fontBuffer;
}

export default defineEventHandler(async (event) => {
  const fontData = await getFontData();

  const { name1, name2, love, friendship, work } = getQuery(event);

  const markup = html`
    <div style="
      background-color: #1a1a1a;
      width: 100%;
      height: 100%;
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 40px;
      font-size: 36px;
      font-family: 'Noto Sans JP';
      background-image: linear-gradient(to bottom right, #6b0f1a, #b91372);
    ">
      <h1 style="font-size: 64px; margin-bottom: 20px;">なんちゃって関係診断</h1>
      <p>${name1 || 'あなた'} × ${name2 || 'あの人'}</p>
      <div style="font-size: 28px; margin-top: 30px;">
        <p>💖 恋愛：${love || '未診断'}</p>
        <p>🤝 友情：${friendship || '未診断'}</p>
        <p>💼 仕事：${work || '未診断'}</p>
      </div>
      <p style="margin-top: 40px; font-size: 20px;">#なんちゃって関係診断</p>
    </div>
  `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Noto Sans JP',
        data: fontData,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { 
      width: 1200,
      height: 630
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  setHeaders(event, {
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=31536000, immutable',
  });

  return pngBuffer;
});
