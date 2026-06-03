import { defineMiddleware } from 'astro:middleware';
import { readSession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = await readSession(context);
  if (context.url.pathname.startsWith('/admin') && context.locals.user?.role !== 'admin' && context.locals.user?.role !== 'editor') {
    return context.redirect('/login?next=' + encodeURIComponent(context.url.pathname));
  }
  return next();
});
