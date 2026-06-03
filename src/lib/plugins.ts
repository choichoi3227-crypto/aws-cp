export interface PluginConfig {
  headerCode: string;
  footerCode: string;
  googleAnalyticsId?: string;
  cloudflareAnalyticsToken?: string;
  adsenseClient?: string;
  cacheTtlSeconds: number;
  robotsExtra: string;
}

export const cacheHeaders = (ttl: number) => ({
  'cache-control': `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${Math.max(ttl * 6, 60)}`
});

export const adsenseScript = (client?: string) => client ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>` : '';
