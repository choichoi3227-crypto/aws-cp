import type { APIRoute } from 'astro';
export const GET: APIRoute = async () => new Response('OAuth provider configuration is ready. Add client id/secret and callback exchange before enabling production login.', { status: 501 });
