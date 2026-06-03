# 인포100

Cloudflare Pages + Astro + D1 기반 뉴스/콘텐츠 CMS입니다. R2를 사용하지 않으며, 미디어 및 생성 파일은 GitHub 저장소에 커밋하는 구조로 설계되어 있습니다.

## 빠른 시작

```bash
npm install
npm run build
wrangler d1 migrations apply info100-db --local
npm run dev
```

## 필수 Cloudflare 환경 변수/시크릿

- `DB`: Cloudflare D1 바인딩
- `SITE_URL`: 사이트 주소
- `ADMIN_EMAIL`: 최초 관리자 이메일
- `ADMIN_PASSWORD_HASH`: PBKDF2 해시(운영에서는 평문 비밀번호 저장 금지)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: 구글 로그인
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`: 네이버 로그인
- `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`: 이미지/페이지 파일 GitHub 저장
- `GOOGLE_ANALYTICS_ID`, `CLOUDFLARE_ANALYTICS_TOKEN`, `GOOGLE_SITE_VERIFICATION`, `NAVER_SITE_VERIFICATION`, `BING_SITE_VERIFICATION`
- `SUPPORT_XML_ENDPOINT`: 관리자 전용 정부지원금 실시간 XML/HTML 수집 엔드포인트

## 배포

```bash
npm run build
npm run deploy
```
