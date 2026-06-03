import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';
export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!requireAdmin(locals.user)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const name = String(form.get('name') || '').trim();
  const slug = String(form.get('slug') || '').trim();
  const parent = form.get('parent_id') ? Number(form.get('parent_id')) : null;
  const sort = Number(form.get('sort_order') || 0);
  if (!name || !slug) return new Response('Name and slug are required', { status: 400 });
  await locals.runtime.env.DB.prepare('INSERT INTO categories(name,slug,parent_id,sort_order) VALUES(?,?,?,?)').bind(name, slug, parent, sort).run();
  return redirect('/admin/categories');
};
