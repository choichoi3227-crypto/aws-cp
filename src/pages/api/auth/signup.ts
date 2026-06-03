import type { APIRoute } from 'astro';
import { createSession, hashPassword } from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals, cookies, redirect }) => {
  const form = await request.formData();
  const email = String(form.get('email') || '').toLowerCase().trim();
  const name = String(form.get('name') || '').trim();
  const password = String(form.get('password') || '');
  if (!email || !name || password.length < 10) return new Response('Invalid signup request', { status: 400 });
  const hash = await hashPassword(password);
  const existingUsers = await locals.runtime.env.DB.prepare('SELECT COUNT(*) AS count FROM users').first<{ count: number }>();
  const role = existingUsers?.count === 0 && email === locals.runtime.env.ADMIN_EMAIL ? 'admin' : 'member';
  const result = await locals.runtime.env.DB.prepare('INSERT INTO users(email,name,password_hash,role) VALUES(?,?,?,?)').bind(email, name, hash, role).run();
  const session = await createSession(locals.runtime.env.DB, Number(result.meta.last_row_id));
  cookies.set('info100_session', session.id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', expires: new Date(session.expires) });
  return redirect('/');
};
