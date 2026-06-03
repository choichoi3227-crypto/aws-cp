import type { APIRoute } from 'astro';
export const POST: APIRoute = async ({ cookies, locals, redirect }) => {
  const sid = cookies.get('info100_session')?.value;
  if (sid) await locals.runtime.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run();
  cookies.delete('info100_session', { path: '/' });
  return redirect('/');
};
