import type { APIContext } from 'astro';
import type { UserSession } from './types';

const encoder = new TextEncoder();
const bytesToHex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, '0')).join('');
const hexToBytes = (hex: string) => new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? []);

export const hashPassword = async (password: string, salt = crypto.randomUUID()) => {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: 210000, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$210000$${salt}$${bytesToHex(bits)}`;
};

export const verifyPassword = async (password: string, stored?: string | null) => {
  if (!stored) return false;
  const [scheme, iterations, salt, expected] = stored.split('$');
  if (scheme !== 'pbkdf2' || !iterations || !salt || !expected) return false;
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: encoder.encode(salt), iterations: Number(iterations), hash: 'SHA-256' }, key, 256);
  const actual = hexToBytes(bytesToHex(bits));
  const target = hexToBytes(expected);
  if (actual.length !== target.length) return false;
  return actual.every((value, index) => value === target[index]);
};

export const createSession = async (db: D1Database, userId: number) => {
  const id = crypto.randomUUID();
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  await db.prepare('INSERT INTO sessions(id, user_id, expires_at) VALUES(?, ?, ?)').bind(id, userId, expires).run();
  return { id, expires };
};

export const readSession = async (context: APIContext): Promise<UserSession | undefined> => {
  const sid = context.cookies.get('info100_session')?.value;
  if (!sid) return undefined;
  const user = await context.locals.runtime.env.DB.prepare(`
    SELECT users.id, users.email, users.name, users.role
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > datetime('now')
  `).bind(sid).first<UserSession>();
  return user ?? undefined;
};

export const requireAdmin = (user?: UserSession) => user?.role === 'admin' || user?.role === 'editor';
