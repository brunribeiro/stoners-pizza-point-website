# Vercel Deployment Optimizations

This document outlines all the performance and security optimizations implemented for Vercel deployment.

## ✅ Implemented Optimizations

### 1. **Configuration Files Created**

#### `vercel.json`

- **Static asset caching**: 1-year cache for fonts, images, icons, and static files
- **Image optimization**: Configured image domains with minimum cache TTL
- **Sentry monitoring**: Rewrite rule for `/monitoring` endpoint

#### `middleware.js`

- **Edge-optimized security headers**: Runs on Vercel's Edge Network
- **Headers added**:
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options` (Clickjacking protection)
  - `X-Content-Type-Options` (MIME sniffing protection)
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `X-DNS-Prefetch-Control`

### 2. **Security Enhancements**

#### `next.config.mjs`

- **Removed `output: 'standalone'`**: Not needed for Vercel (causes deployment issues)
- **Added Content Security Policy (CSP)**: Prevents XSS and other injection attacks
- **Environment validation**: Automatic check on build

#### `lib/config.js`

- **Enhanced session security**:
  - `httpOnly: true` - Prevents JavaScript access to cookies
  - `sameSite: 'lax'` - CSRF protection
  - `maxAge` and `ttl` - 7-day session expiration
  - Support for `SESSION_SECRET` environment variable

#### `lib/env.js`

- **Environment variable validation**: Fails fast if required vars are missing
- **Build-time checks**: Ensures all required env vars are set before deployment

### 3. **Performance Optimizations**

#### `pages/_document.js`

- **DNS prefetching**: Added for PostHog, Atlas, and Google Maps
- **Optimized font loading**:
  - Reduced Lato font weights (from 10 to 4 variants)
  - Added `display=swap` for better font loading
  - Preload critical fonts (Chivo-Regular, MI_StonedType-Regular)
- **Deferred font loading**: Using `media="print"` trick

#### `pages/sitemap.xml.js`

- **Dynamic sitemap generation**: SEO-friendly sitemap
- **Cache headers**: 1-hour cache, 24-hour stale-while-revalidate

## 🔧 Environment Variables Required

Add these to your Vercel project settings:

### Required

```
NEXT_PUBLIC_FETCH_URL=your_api_url
NEXT_PUBLIC_DOMAIN_URL=https://stonerspizza.app
NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY=your_recaptcha_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Recommended (Optional)

```
SESSION_SECRET=generate_a_32_character_random_string
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**To generate SESSION_SECRET:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Expected Performance Improvements

### Caching Benefits

- **Static assets**: Cached for 1 year (immutable)
- **Fonts**: Instant loading on repeat visits
- **Images**: Edge-optimized via Vercel Image Optimization

### Security Score Improvements

- **A+ Security Headers**: All major security headers implemented
- **CSP Protection**: Prevents XSS, injection, and clickjacking attacks
- **HTTPS Enforcement**: `upgrade-insecure-requests` directive
- **Cookie Security**: httpOnly, secure, and sameSite flags

### Core Web Vitals Impact

- **LCP (Largest Contentful Paint)**: Improved via font optimization and preloading
- **CLS (Cumulative Layout Shift)**: Reduced via font-display:swap and preloading
- **FID (First Input Delay)**: Better via Edge middleware and optimized bundle

## 🚀 Deployment Steps

1. **Push changes to your repository**
2. **Set environment variables in Vercel dashboard**
3. **Deploy to Vercel** - It will automatically detect Next.js
4. **Verify deployment**:
   - Check sitemap: `https://stonerspizza.app/sitemap.xml`
   - Test security headers: Use [securityheaders.com](https://securityheaders.com)
   - Check performance: Use Lighthouse or WebPageTest

## 🔍 Testing Checklist

- [ ] Build completes without errors
- [ ] All environment variables are set
- [ ] Sitemap.xml loads correctly
- [ ] Security headers are present (check browser DevTools)
- [ ] Fonts load without FOUT (Flash of Unstyled Text)
- [ ] Google Maps works
- [ ] PostHog analytics tracks events
- [ ] Atlas chat widget loads for logged-in users
- [ ] Session cookies are secure (httpOnly, secure flags)

## 📈 Monitoring

After deployment, monitor:

- **Vercel Analytics** (if enabled)
- **Sentry** for error tracking
- **PostHog** for user analytics
- **Lighthouse scores** for Core Web Vitals
- **Security Headers** via [securityheaders.com](https://securityheaders.com)

## 🔄 Future Optimizations (Optional)

Consider these for further improvements:

1. **Convert pages to ISR (Incremental Static Regeneration)**:
   - Replace `getServerSideProps` with `getStaticProps` where possible
   - Add `revalidate` for automatic regeneration

2. **Optimize images**:
   - Convert remaining PNGs/JPGs to WebP
   - Use Next.js `<Image>` component everywhere

3. **Code splitting**:
   - Lazy load heavy components (modals, overlays)
   - Use `dynamic()` for non-critical imports

4. **API route optimization**:
   - Add edge runtime to API routes where possible
   - Implement request caching

5. **Edge Config**:
   - Use for feature flags and A/B testing
   - Implement maintenance mode without redeployment

## 📝 Notes

- All files follow ESLint and Prettier rules
- Changes are backward-compatible
- No breaking changes to existing functionality
- Optimized specifically for Vercel's infrastructure

---

**Last Updated**: October 2025
**Next.js Version**: 14.2.8
**Node Version**: Check `.nvmrc` or `package.json` engines field
