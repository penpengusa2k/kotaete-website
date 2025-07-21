import { defineEventHandler, getQuery, readBody, setHeader } from 'h3';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const query = getQuery(event);

  // スプレッドシートからタイトルを取得するロジック（既存のgas-proxyを再利用）
  let title = 'KOTAETE'; // デフォルトタイトル
  try {
    const surveyRes = await $fetch(`/api/gas-proxy?action=get&id=${id}`);
    if (surveyRes.result === 'success' && surveyRes.data && surveyRes.data.title) {
      title = surveyRes.data.title;
    }
  } catch (e) {
    console.error('Error fetching survey title for OGP:', e);
    // エラー時もデフォルトタイトルで続行
  }

  const basePath = process.cwd();
  const ogpBaseImagePath = path.join(basePath, 'public', 'ogp-base.jpg');

  try {
    // ベース画像を読み込む
    const imageBuffer = await fs.readFile(ogpBaseImagePath);
    const image = sharp(imageBuffer);

    // 画像のメタデータを取得
    const metadata = await image.metadata();
    const width = metadata.width;
    const height = metadata.height;

    // テキストの描画設定
    const svgText = `
      <svg width="${width}" height="${height}">
        <style>
          .title {
            font-family: 'Noto Sans JP', sans-serif;
            font-size: 60px;
            font-weight: bold;
            fill: #333;
            text-align: center;
            dominant-baseline: middle;
            text-anchor: middle;
          }
        </style>
        <text x="${width / 2}" y="${height / 2 - 50}" class="title">${title}</text>
      </svg>
    `;

    // SVGを画像に合成
    const outputBuffer = await image
      .composite([{
        input: Buffer.from(svgText),
        top: 0,
        left: 0,
      }])
      .jpeg({ quality: 90 })
      .toBuffer();

    setHeader(event, 'Content-Type', 'image/jpeg');
    return outputBuffer;

  } catch (error) {
    console.error('Error generating OGP image:', error);
    // エラー時はデフォルトのOGP画像を返すか、エラー画像を生成する
    // ここでは、エラーが発生した場合は404を返す例
    event.res.statusCode = 404;
    return 'OGP image not found or could not be generated.';
  }
});
