import type { APIRoute } from 'astro';
import { setting } from '@/lib/db';
export const GET: APIRoute = async ({ locals }) => {
  const site = locals.runtime.env.SITE_URL || 'https://info100.kr';
  const extra = await setting(locals.runtime.env.DB, 'robots_extra');
  return new Response(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${site}/sitemap-index.xml\n${extra}\n`, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
