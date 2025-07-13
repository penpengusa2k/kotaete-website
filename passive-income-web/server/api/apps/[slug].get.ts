
import { apps } from '~/server/data/apps';

export default defineEventHandler((event) => {
  const slug = event.context.params?.slug;
  const app = apps.find(a => a.slug === slug);

  if (!app) {
    throw createError({ statusCode: 404, statusMessage: 'App Not Found' });
  }
  return app;
});
