import { defineEventHandler, setHeader } from 'h3';
import sharp from 'sharp';
import TextToSVG from 'text-to-svg';
import { tmpdir } from 'os';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  let title = 'KOTAETE';
  let description = 'KOTAETEは簡単・無料のアンケート作成サービスです。';

  try {
    const surveyRes = await $fetch(`/api/gas-proxy?action=get&id=${id}`) as { result: string; data?: { title?: string; description?: string } };
    if (surveyRes.result === 'success' && surveyRes.data) {
      title = surveyRes.data.title || title;
      // 絵文字を除去
      title = title.replace(/\p{Emoji_Presentation}/gu, '');
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

    const fontBuffer = await storage.getItemRaw('assets:server:KiwiMaru-Regular.ttf');
    if (!fontBuffer) throw new Error('Font file not found');

    // 一時ファイルにフォントを書き出す
    const tempFontPath = path.join(tmpdir(), `KiwiMaru-Regular-${Date.now()}.ttf`);
    await writeFile(tempFontPath, fontBuffer);

    const textToSVG = TextToSVG.loadSync(tempFontPath); // ここで文字化け回避
    await unlink(tempFontPath); // 読み込んだら削除（クリーンアップ）

    const targetWidth = 1200;
    const targetHeight = 600;
    const fontSize = 40;
    const textYOffset = 20; // 折り返しによるずれを考慮して調整
    const startX = targetWidth * 0.22; // 左マージンを22%に設定 (折り返し計算用)
    const textAreaWidth = targetWidth * 0.56; // テキストエリア幅56% (折り返し計算用)

    const lines: string[] = [];
    let currentLine = '';
    const maxCharsPerLine = Math.floor(textAreaWidth / fontSize);

    for (const char of title) {
      if (currentLine.length >= maxCharsPerLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      currentLine += char;
    }
    lines.push(currentLine);

    const lineHeight = fontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;
    const startY = (targetHeight - totalTextHeight) / 2 + textYOffset;

    let svgText = '';
    lines.forEach((lineText, index) => {
      const svgPath = textToSVG.getPath(lineText, {
        x: targetWidth / 2, // 中央揃え
        y: startY + index * lineHeight,
        fontSize: fontSize,
        anchor: 'top center', // 中央揃え
        attributes: {
          fill: '#9575CD',         // ← ここに好きなパープルコード
          'fill-opacity': '1.0'    // 薄めたいときは 0.8〜0.9 もOK
        }
      });
      svgText += svgPath;
    });

    const fullSvg = `<svg width="${targetWidth}" height="${targetHeight}">${svgText}</svg>`;
    const svgPngBuffer = await sharp(Buffer.from(fullSvg)).png().toBuffer();

    const outputBuffer = await image
      .resize(targetWidth, targetHeight, { fit: 'contain' })
      .composite([{ input: svgPngBuffer, top: 0, left: 0 }])
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
