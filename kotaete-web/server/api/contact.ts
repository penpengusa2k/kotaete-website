import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const gasApiUrl = config.public.gasApiUrl;

  if (!gasApiUrl) {
    console.error('GAS API URL is not configured.');
    return { result: 'error', message: 'Server configuration error.' };
  }

  try {
    const body = await readBody(event);
    
    // GASに送信するデータ構造を定義
    const gasPayload = {
      action: 'contact',
      data: {
        name: body.name,
        email: body.email,
        message: body.message,
      },
    };

    const response = await $fetch(gasApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // GASのdoPostがtext/plainを期待するため
      },
      body: JSON.stringify(gasPayload),
    });

    // GASからのレスポンスをそのまま返す
    return response;
  } catch (error) {
    console.error('Error processing contact form:', error);
    return { result: 'error', message: 'お問い合わせの送信に失敗しました。' };
  }
});