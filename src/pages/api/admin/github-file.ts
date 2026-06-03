import type { APIRoute } from 'astro';
import { requireAdmin } from '@/lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  if (!requireAdmin(locals.user)) return new Response('Forbidden', { status: 403 });
  const env = locals.runtime.env;
  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) return new Response('GitHub environment variables are missing', { status: 400 });
  const form = await request.formData();
  const file = form.get('file');
  const path = String(form.get('path') || 'images/' + crypto.randomUUID());
  if (!(file instanceof File)) return new Response('File is required', { status: 400 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  let binary = '';
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  const response = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: { authorization: `Bearer ${env.GITHUB_TOKEN}`, accept: 'application/vnd.github+json', 'user-agent': 'info100-cms' },
    body: JSON.stringify({ message: `Upload ${path}`, content: btoa(binary), branch: env.GITHUB_BRANCH || 'main' })
  });
  if (!response.ok) return new Response(await response.text(), { status: response.status });
  return Response.json(await response.json());
};
