import { defineEventHandler, readBody, getQuery, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const gasApiUrl = config.public.gasApiUrl;

  if (!gasApiUrl) {
    throw createError({
      statusCode: 500,
      message: 'GAS API URL is not configured.',
    });
  }

  const method = event.node.req.method?.toUpperCase() || 'GET';
  const query = getQuery(event);
  const isBodyMethod = ['POST', 'PUT', 'PATCH'].includes(method);
  const body = isBodyMethod ? await readBody(event) : undefined;

  let url = gasApiUrl;
  if (method === 'GET' && Object.keys(query).length > 0) {
    const queryParams = new URLSearchParams(query as Record<string, string>).toString();
    url += `?${queryParams}`;
  }

  try {
    const response = await $fetch(url, {
      method: method as any,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(isBodyMethod && body ? { body } : {}),
    });
    return response;
  } catch (error) {
    console.error('Proxy error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to proxy request to GAS API.',
      data: error,
    });
  }
});
