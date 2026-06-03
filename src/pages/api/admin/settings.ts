import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!requireAdmin(locals.user)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  for (const [key, value] of form.entries()) {
    await locals.runtime.env.DB.prepare('INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP').bind(key, String(value)).run();
  }
  return redirect('/admin/seo');
};
