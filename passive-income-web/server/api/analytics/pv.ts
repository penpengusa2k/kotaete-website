// server/api/analytics/pv.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const { propertyId } = getQuery(event);

  if (!propertyId || !config.gaPrivateKeyId || !config.gaPrivateKey || !config.gaClientEmail) {
    console.error('GA4 Property ID and/or service account credentials are not provided for Analytics API.');
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: Analytics credentials missing.',
    });
  }

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: config.gaClientEmail,
      private_key: config.gaPrivateKey.replace(/\\n/g, '\n'),
      private_key_id: config.gaPrivateKeyId,
    },
  });

  const today = new Date();
  const startDate = '2025-06-25';
  const endDate = today.toISOString().split('T')[0]; // 今日の日付

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startDate, endDate: endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
    });

    const monthlyDataMap = new Map();

    response.rows?.forEach(row => {
      const dateStr = row.dimensionValues?.[0]?.value;
      const pv = parseInt(row.metricValues?.[0]?.value || '0', 10);

      if (!dateStr) {
          // 日付データがない場合はスキップ
          console.warn('Skipping row due to missing date dimension:', row);
          return;
      }

      const year = dateStr.substring(0, 4);
      const month = parseInt(dateStr.substring(4, 6), 10);
      const monthKey = `${year}年${month}月`;

      // 月ごとの累計PVを更新
      const currentMonthCumulative = (monthlyDataMap.get(monthKey) || 0) + pv;
      monthlyDataMap.set(monthKey, currentMonthCumulative);
    });

    const labels = Array.from(monthlyDataMap.keys()).sort((a, b) => {
    const parseDate = (dateStr: string): Date => {
      const parts: string[] = dateStr.replace('年', '-').replace('月', '').split('-');
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1);
    };
      return parseDate(a).getTime() - parseDate(b).getTime();
    });

    const data = labels.map(label => monthlyDataMap.get(label));

    return {
      labels: labels,
      data: data,
    };

  } catch (err) {
    console.error('Error fetching GA4 PV data:', err);
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch GA4 PV data: ${errorMessage}`,
    });
  }
});
