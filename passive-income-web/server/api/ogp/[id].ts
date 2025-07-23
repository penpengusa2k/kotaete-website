import { defineEventHandler, setHeader } from 'h3';
import sharp from 'sharp';
import { useStorage } from '#imports';

// テキストをSVGとして生成するヘルパー関数
interface GenerateSvgForTextOptions {
  text: string;
  width: number;
  height: number;
  fontSize: number;
  yOffset: number;
  fontBase64: string; // Base64エンコードされたフォントを追加
}

const generateSvgForText = (
  text: GenerateSvgForTextOptions['text'],
  width: GenerateSvgForTextOptions['width'],
  height: GenerateSvgForTextOptions['height'],
  fontSize: GenerateSvgForTextOptions['fontSize'],
  yOffset: GenerateSvgForTextOptions['yOffset'],
  fontBase64: GenerateSvgForTextOptions['fontBase64']
): string => {
  // 日本語のテキストを文字数に応じて折り返す
  let line = '';
  const lines: string[] = [];
  // テキストエリアの幅を画像の80%に設定し、1行あたりの最大文字数を計算
  const textAreaWidth = width * 0.8;
  const maxCharsPerLine = Math.floor(textAreaWidth / fontSize);

  for (const char of text) {
    if (line.length >= maxCharsPerLine) {
      lines.push(line);
      line = '';
    }
    line += char;
  }
  lines.push(line);

  const lineHeight: number = fontSize * 1.2;
  const totalTextHeight: number = lines.length * lineHeight;
  const startY: number = (height - totalTextHeight) / 2 + yOffset;
  const startX: number = width * 0.1; // 左マージンを10%に設定

  let svgContent: string = `<svg width="${width}" height="${height}">`;
  svgContent += `<defs>
    <style type="text/css">
      @font-face {
        font-family: 'NotoSansJP';
        src: url('data:font/truetype;charset=utf-8;base64,${fontBase64}') format('truetype');
      }
      .title {
        font-family: 'NotoSansJP';
        font-size: ${fontSize}px;
        font-weight: bold;
        fill: #333;
        text-anchor: start; /* 左揃えに変更 */
      }
    </style>
  </defs>`;

  lines.forEach((l: string, index: number) => {
    svgContent += `<text x="${startX}" y="${startY + index * lineHeight}" class="title">${l}</text>`;
  });
  svgContent += `</svg>`;

  return svgContent;
};

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  let title = 'KOTAETE'; // デフォルトタイトル
  let description = 'KOTAETEは簡単・無料のアンケート作成サービスです。'; // デフォルトディスクリプション

  try {
    const surveyRes = await $fetch(`/api/gas-proxy?action=get&id=${id}`) as { result: string; data?: { title?: string; description?: string } };
    if (surveyRes.result === 'success' && surveyRes.data) {
      title = surveyRes.data.title || title;
      description = surveyRes.data.description || description;
    }
  } catch (e) {
    console.error('Error fetching survey title for OGP:', e);
  }

  try {
    const storage = useStorage();

    const imageBuffer = await storage.getItemRaw('assets:server:ogp-base.jpg');
    if (!imageBuffer) throw new Error('OGP base image not found');
    let image = sharp(imageBuffer);

    const fontBuffer = await storage.getItemRaw('assets:server:NotoSansJP-Bold.ttf');
    if (!fontBuffer) throw new Error('Font file not found');
    const fontBase64 = Buffer.from(fontBuffer).toString('base64');

    // OGP推奨サイズにリサイズ
    const targetWidth = 1200;
    const targetHeight = 630;

    // テキストの描画
    const fontSize = 60;
    const textYOffset = -30; // 少し下に調整

    const svgText = generateSvgForText(title, targetWidth, targetHeight, fontSize, textYOffset, fontBase64);

    // SVGを画像に合成
    const outputBuffer = await image
      .resize(targetWidth, targetHeight, { fit: 'cover' })
      .composite([{
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    setHeader(event, 'Content-Type', 'image/jpeg');
    setHeader(event, 'Cache-Control', 'public, max-age=604800');
    setHeader(event, 'Content-Disposition', 'inline');
    return outputBuffer;

  } catch (error) {
    console.error('Error generating OGP image:', error);
    event.res.statusCode = 500;
    return 'Internal Server Error';
  }
});
