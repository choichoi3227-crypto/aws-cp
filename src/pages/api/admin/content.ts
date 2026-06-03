import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  if (!requireAdmin(locals.user)) return new Response('Forbidden', { status: 403 });
  const form = await request.formData();
  const id = String(form.get('id') || '');
  const values = {
    type: String(form.get('type') || 'post'),
    title: String(form.get('title') || '').trim(),
    slug: String(form.get('slug') || '').trim(),
    excerpt: String(form.get('excerpt') || '').trim(),
    body_html: String(form.get('body_html') || '').trim(),
    body_blocks: String(form.get('body_blocks') || '').trim(),
    category_id: form.get('category_id') ? Number(form.get('category_id')) : null,
    thumbnail_url: String(form.get('thumbnail_url') || '').trim(),
    status: String(form.get('status') || 'draft'),
    visibility: String(form.get('visibility') || 'public'),
    seo_title: String(form.get('seo_title') || '').trim(),
    seo_description: String(form.get('seo_description') || '').trim(),
    seo_keywords: String(form.get('seo_keywords') || '').trim(),
    schema_json: String(form.get('schema_json') || '').trim(),
    published_at: String(form.get('published_at') || new Date().toISOString())
  };
  if (!values.title || !values.slug || !values.body_html) return new Response('Required fields missing', { status: 400 });
  if (id) {
    await locals.runtime.env.DB.prepare(`UPDATE content SET type=?,title=?,slug=?,excerpt=?,body_html=?,body_blocks=?,category_id=?,thumbnail_url=?,status=?,visibility=?,seo_title=?,seo_description=?,seo_keywords=?,schema_json=?,published_at=?,updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(...Object.values(values), id).run();
  } else {
    await locals.runtime.env.DB.prepare(`INSERT INTO content(type,title,slug,excerpt,body_html,body_blocks,category_id,thumbnail_url,status,visibility,seo_title,seo_description,seo_keywords,schema_json,published_at,author_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(...Object.values(values), locals.user?.id).run();
  }
  return redirect('/admin/posts');
};
