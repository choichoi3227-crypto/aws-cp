export interface SupportItem { title: string; agency?: string; summary?: string; target_url?: string; raw_payload: string; }

const textBetween = (source: string, tag: string) => source.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))?.[1]?.replace(/<[^>]+>/g, '').trim();

export const parseSupportFeed = (raw: string): SupportItem[] => {
  const items = [...raw.matchAll(/<item[\s\S]*?<\/item>|<row[\s\S]*?<\/row>|<li[\s\S]*?<\/li>/gi)].map((match) => match[0]);
  const blocks = items.length ? items : [...raw.matchAll(/<article[\s\S]*?<\/article>/gi)].map((match) => match[0]);
  return blocks.map((block) => ({
    title: textBetween(block, 'title') || textBetween(block, 'servNm') || textBetween(block, 'a') || '',
    agency: textBetween(block, 'agency') || textBetween(block, 'jurMnofNm') || textBetween(block, 'department'),
    summary: textBetween(block, 'description') || textBetween(block, 'servDgst') || textBetween(block, 'p'),
    target_url: block.match(/href=["']([^"']+)["']/i)?.[1] || textBetween(block, 'link'),
    raw_payload: block
  })).filter((item) => item.title);
};

export const fetchSupportItems = async (endpoint: string) => {
  const response = await fetch(endpoint, { headers: { accept: 'application/xml,text/xml,text/html' } });
  if (!response.ok) throw new Error(`지원금 수집 실패: ${response.status}`);
  return parseSupportFeed(await response.text());
};
