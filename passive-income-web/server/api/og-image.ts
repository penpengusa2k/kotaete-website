import { ImageResponse } from '@vercel/og';
import { getPairId, generateResultFromId } from '~/utils/resultGenerator.ts';

export default defineEventHandler(async (event) => {
  const { name1, name2 } = getQuery(event);

  if (!name1 || !name2) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Both names are required for OGP image generation.',
    });
  }

  const pairId = getPairId(name1 as string, name2 as string);
  const results = generateResultFromId(pairId);

  const averageCompatibility = (() => {
    if (!results) return null;
    let total = 0;
    let count = 0;
    if (results.love) {
      total += results.love.compatibility;
      count++;
    }
    if (results.friendship) {
      total += results.love.compatibility;
      count++;
    }
    if (results.work) {
      total += results.love.compatibility;
      count++;
    }
    return count > 0 ? Math.floor(total / count) : null;
  })();

  const htmlContent = `
    <div style="display: flex; flex-direction: column; width: 100%; height: 100%; background-color: #ffe4e6; align-items: center; justify-content: center; font-family: 'Noto Sans JP', sans-serif; padding: 40px; text-align: center;">
      <h1 style="font-size: 60px; color: #e01a4f; margin-bottom: 20px;">
        地獄の関係相性チェッカー 🔥
      </h1>
      <p style="font-size: 36px; color: #333; margin-bottom: 10px;">
        ${name1} と ${name2} の関係は...
      </p>
      ${averageCompatibility !== null ? `
        <p style="font-size: 48px; color: #e01a4f; font-weight: bold;">
          総合相性地獄度: ${averageCompatibility}%
        </p>
      ` : ''}
      <div style="display: flex; flex-direction: column; margin-top: 30px; font-size: 28px; color: #555;">
        ${results.love ? `<p>💘 恋愛: ${results.love.title} (${results.love.compatibility}%)</p>` : ''}
        ${results.friendship ? `<p>👯‍♀️ 友情: ${results.friendship.title} (${results.friendship.compatibility}%)</p>` : ''}
        ${results.work ? `<p>💼 仕事: ${results.work.title} (${results.work.compatibility}%)</p>` : ''}
      </div>
    </div>
  `;

  return new ImageResponse(htmlContent, {
    width: 1200,
    height: 630,
    // fonts: [
    //   {
    //     name: 'Noto Sans JP',
    //     data: fontData,
    //     weight: 700,
    //     style: 'normal',
    //   },
    // ],
  });
});
