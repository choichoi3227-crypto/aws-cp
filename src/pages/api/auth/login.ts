import type { APIRoute } from 'astro';
import { createSession, verifyPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') || '').toLowerCase().trim();
  const password = String(form.get('password') || '');
  const next = String(form.get('next') || '/');
  let user = await locals.runtime.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<{ id:number; email:string; password_hash:string|null; role:string }>();
  if (!user && email === locals.runtime.env.ADMIN_EMAIL && locals.runtime.env.ADMIN_PASSWORD_HASH) {
    const result = await locals.runtime.env.DB.prepare('INSERT INTO users(email,name,password_hash,role) VALUES(?,?,?,?)').bind(email, '관리자', locals.runtime.env.ADMIN_PASSWORD_HASH, 'admin').run();
    user = { id: Number(result.meta.last_row_id), email, password_hash: locals.runtime.env.ADMIN_PASSWORD_HASH, role: 'admin' };
  }
  if (!user || !(await verifyPassword(password, user.password_hash))) return new Response('Login failed', { status: 401 });
  const session = await createSession(locals.runtime.env.DB, user.id);
  cookies.set('info100_session', session.id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', expires: new Date(session.expires) });
  return redirect(next.startsWith('/') ? next : '/');
};
