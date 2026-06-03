/// <reference types="astro/client" />

type D1Database = import('@cloudflare/workers-types').D1Database;

interface RuntimeEnv {
  DB: D1Database;
  SITE_URL: string;
  SITE_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  NAVER_CLIENT_ID?: string;
  NAVER_CLIENT_SECRET?: string;
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  GOOGLE_ANALYTICS_ID?: string;
  CLOUDFLARE_ANALYTICS_TOKEN?: string;
  GOOGLE_SITE_VERIFICATION?: string;
  NAVER_SITE_VERIFICATION?: string;
  BING_SITE_VERIFICATION?: string;
  SUPPORT_XML_ENDPOINT?: string;
}

declare namespace App {
  interface Locals {
    runtime: { env: RuntimeEnv };
    user?: import('@/lib/types').UserSession;
  }
}
