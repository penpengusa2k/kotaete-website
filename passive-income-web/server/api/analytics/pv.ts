// server/api/analytics/pv.ts
import { defineEventHandler, createError } from 'h3';
import { ofetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
  const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID; // Optional, if using a team

  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    console.error('Vercel API Token or Project ID is not provided.');
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Vercel credentials missing.',
    });
  }

  // 過去90日間のデータを取得 (無料枠のデータ保持期間に合わせて調整)
  const now = new Date();
  const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90)); // 90日間に変更
  const start = ninetyDaysAgo.toISOString();
  const end = new Date().toISOString();

  // metrics エンドポイントを使用し、granularity=day で日ごとのデータを取得
  const baseUrl = `https://api.vercel.com/v6/analytics/metrics?projectId=${VERCEL_PROJECT_ID}`;
  const teamIdParam = VERCEL_TEAM_ID ? `&teamId=${VERCEL_TEAM_ID}` : '';
  const queryParams = `&start=${start}&end=${end}&metrics=pageviews&granularity=day`; // granularity=day を追加
  const url = `${baseUrl}${teamIdParam}${queryParams}`;

  try {
    const response = await ofetch(url, {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      },
    });

    if (response.status && response.status >= 400) {
      console.error('Vercel Analytics API Error:', response.status, response.statusText, response.data);
      throw createError({
        statusCode: response.status,
        statusMessage: `Vercel Analytics API returned an error: ${response.statusText || 'Unknown Error'}`,
        data: response.data,
      });
    }

    // API レスポンスから日ごとの PV データを抽出
    const dailyData = response.metrics.pageviews.map((item: any) => ({
      date: item.timestamp,
      value: item.value,
    }));

    interface DailyPageview {
      date: string;
      value: number;
    }

    const labels = dailyData.map((item: DailyPageview) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    interface DailyData {
      date: string;
      value: number;
    }

    const data: number[] = dailyData.map((item: DailyData) => item.value);

    return {
      labels: labels,
      data: data,
    };

  } catch (err: any) {
    console.error('Error fetching Vercel Analytics data:', err.message || err);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch Vercel Analytics data: ${err.message || 'unknown_error'}`,
    });
  }
});
