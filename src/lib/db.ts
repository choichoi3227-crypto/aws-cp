import type { Category, ContentItem } from './types';

export const setting = async (db: D1Database, key: string, fallback = '') => {
  const row = await db.prepare('SELECT value FROM site_settings WHERE key = ?').bind(key).first<{ value: string }>();
  return row?.value ?? fallback;
};

export const settings = async (db: D1Database) => {
  const rows = await db.prepare('SELECT key, value FROM site_settings').all<{ key: string; value: string }>();
  return Object.fromEntries((rows.results ?? []).map((row) => [row.key, row.value]));
};

export const categories = async (db: D1Database) => {
  const rows = await db.prepare('SELECT * FROM categories ORDER BY parent_id NULLS FIRST, sort_order, name').all<Category>();
  return rows.results ?? [];
};

export const publicContent = async (db: D1Database, type: 'post' | 'notice', limit = 12) => {
  const rows = await db.prepare(`
    SELECT content.*, categories.name AS category_name, categories.slug AS category_slug
    FROM content LEFT JOIN categories ON categories.id = content.category_id
    WHERE content.type = ? AND content.status = 'published' AND content.visibility IN ('public','members')
    ORDER BY COALESCE(content.published_at, content.created_at) DESC
    LIMIT ?
  `).bind(type, limit).all<ContentItem>();
  return rows.results ?? [];
};

export const getContentBySlug = async (db: D1Database, slug: string, type?: string) => {
  const sql = `
    SELECT content.*, categories.name AS category_name, categories.slug AS category_slug
    FROM content LEFT JOIN categories ON categories.id = content.category_id
    WHERE content.slug = ? ${type ? 'AND content.type = ?' : ''} LIMIT 1
  `;
  const stmt = type ? db.prepare(sql).bind(slug, type) : db.prepare(sql).bind(slug);
  return stmt.first<ContentItem>();
};

export const relatedContent = async (db: D1Database, item: ContentItem, limit = 6) => {
  const rows = await db.prepare(`
    SELECT content.*, categories.name AS category_name, categories.slug AS category_slug
    FROM content LEFT JOIN categories ON categories.id = content.category_id
    WHERE content.id != ? AND content.type = ? AND content.status = 'published'
      AND content.visibility IN ('public','members')
      AND (content.category_id = ? OR ? IS NULL)
    ORDER BY COALESCE(content.published_at, content.created_at) DESC
    LIMIT ?
  `).bind(item.id, item.type, item.category_id, item.category_id, limit).all<ContentItem>();
  return rows.results ?? [];
};
