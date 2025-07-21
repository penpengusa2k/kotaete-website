import { defineEventHandler, getQuery, setHeader } from 'h3';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// テキストをSVGとして生成するヘルパー関数
interface GenerateSvgForTextOptions {
  text: string;
  width: number;
  height: number;
  fontSize: number;
  yOffset: number;
}

const generateSvgForText = (
  text: GenerateSvgForTextOptions['text'],
  width: GenerateSvgForTextOptions['width'],
  height: GenerateSvgForTextOptions['height'],
  fontSize: GenerateSvgForTextOptions['fontSize'],
  yOffset: GenerateSvgForTextOptions['yOffset']
): string => {
  // 簡易的なテキスト折り返し（日本語の文字幅は考慮しない）
  const words: string[] = text.split(' ');
  let line: string = '';
  let lines: string[] = [];
  const maxCharsPerLine: number = Math.floor(width / (fontSize * 0.6)); // 簡易的な文字数計算

  for (const word of words) {
    if ((line + word).length > maxCharsPerLine && line.length > 0) {
      lines.push(line.trim());
      line = word + ' ';
    } else {
      line += word + ' ';
    }
  }
  lines.push(line.trim());

  const lineHeight: number = fontSize * 1.2;
  const totalTextHeight: number = lines.length * lineHeight;
  const startY: number = (height - totalTextHeight) / 2 + yOffset;

  let svgContent: string = `<svg width="${width}" height="${height}">`;
  svgContent += `<style>
    .title {
      font-family: sans-serif; /* 汎用フォントを使用 */
      font-size: ${fontSize}px;
      font-weight: bold;
      fill: #333;
      text-anchor: middle;
    }
  </style>`;

  lines.forEach((l: string, index: number) => {
    svgContent += `<text x="${width / 2}" y="${startY + index * lineHeight}" class="title">${l}</text>`;
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

  const basePath = process.cwd();
  const ogpBaseImagePath = path.resolve(__dirname, '..' , '..' , 'public', 'ogp-base.jpg');
  const fontPath = path.join(basePath, 'public', 'fonts', 'NotoSansJP-Bold.ttf'); // フォントファイルのパス

  try {
    // ベース画像を読み込む
    const imageBuffer = await fs.readFile(ogpBaseImagePath);
    let image = sharp(imageBuffer);

    // OGP推奨サイズにリサイズ
    const targetWidth = 1200;
    const targetHeight = 630; // Twitter推奨のアスペクト比1.91:1に近い

    // テキストの描画
    const fontSize = 60;
    const textYOffset = -50; // タイトルを少し上に配置

    const svgText = generateSvgForText(title, targetWidth, targetHeight, fontSize, textYOffset);

    // SVGを画像に合成
    const outputBuffer = await image
      .resize(targetWidth, targetHeight, { fit: 'cover' }) // アスペクト比を維持しつつ、指定サイズに収まるようにリサイズ
      .composite([{
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
        // フォントを埋め込む場合はここに追加
        // options: { font: fontPath } // sharpのcompositeオプションでフォント指定
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    setHeader(event, 'Content-Type', 'image/jpeg');
    setHeader(event, 'Cache-Control', 'public, max-age=604800'); // 1週間キャッシュ
    setHeader(event, 'Content-Disposition', 'inline');
    return outputBuffer;

  } catch (error) {
    console.error('Error generating OGP image:', error);
    // エラー時はベース画像をそのまま返す
    try {
      const fallbackImageBuffer = await fs.readFile(ogpBaseImagePath);
      setHeader(event, 'Content-Type', 'image/jpeg');
      setHeader(event, 'Cache-Control', 'public, max-age=604800');
      setHeader(event, 'Content-Disposition', 'inline');
      return fallbackImageBuffer;
    } catch (fallbackError) {
      console.error('Error serving fallback OGP image:', fallbackError);
      event.res.statusCode = 500;
      return 'Internal Server Error';
    }
  }
});
