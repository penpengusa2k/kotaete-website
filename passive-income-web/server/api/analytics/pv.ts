// server/api/analytics/pv.ts
import { defineEventHandler } from 'h3';
import { parseISO, format, subDays } from 'date-fns';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const VERCEL_API_TOKEN = config.vercelApiToken;
  const VERCEL_PROJECT_ID = config.vercelProjectId;

  if (!VERCEL_API_TOKEN || !VERCEL_PROJECT_ID) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Vercel API Token or Project ID not set in runtime config',
    });
  }

  const now = new Date();
  const from = subDays(now, 90);
  const fromISO = from.toISOString();
  const toISO = now.toISOString();

  const res = await fetch(
    `https://api.vercel.com/v6/insights/analytics/${VERCEL_PROJECT_ID}/timeseries?start=${fromISO}&end=${toISO}&resolution=1d`,
    {
      headers: {
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw createError({
      statusCode: res.status,
      statusMessage: `Vercel Analytics API failed: ${errorBody}`,
    });
  }

  const json = await res.json();

  const labels: string[] = [];
  const data: number[] = [];

  for (const point of json.data || []) {
    labels.push(format(parseISO(point.timestamp), 'yyyy-MM-dd'));
    data.push(point.value);
  }

  return {
    labels,
    data,
  };
});
