import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
import { fetchSupportItems } from '@/lib/support';

export const POST: APIRoute = async ({ locals }) => {
  if (!requireAdmin(locals.user)) return new Response('Forbidden', { status: 403 });
  const endpoint = locals.runtime.env.SUPPORT_XML_ENDPOINT;
  if (!endpoint) return new Response('SUPPORT_XML_ENDPOINT is not configured', { status: 400 });
  const items = await fetchSupportItems(endpoint);
  await locals.runtime.env.DB.prepare('DELETE FROM support_cache').run();
  for (const item of items.slice(0, 200)) {
    await locals.runtime.env.DB.prepare('INSERT INTO support_cache(source_url,title,agency,summary,target_url,raw_payload) VALUES(?,?,?,?,?,?)').bind(endpoint, item.title, item.agency || '', item.summary || '', item.target_url || '', item.raw_payload).run();
  }
  return Response.json({ count: items.length, items: items.slice(0, 50) });
};
