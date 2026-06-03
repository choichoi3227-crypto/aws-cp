export interface UserSession {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'member';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  sort_order: number;
}

export interface ContentItem {
  id: number;
  type: 'post' | 'notice' | 'page';
  title: string;
  slug: string;
  excerpt: string | null;
  body_html: string;
  body_blocks: string | null;
  category_id: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  thumbnail_url: string | null;
  status: 'draft' | 'published' | 'private';
  visibility: 'public' | 'members' | 'admin';
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  schema_json: string | null;
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
