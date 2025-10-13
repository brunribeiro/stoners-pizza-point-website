# Vercel Deployment Checklist

## Pre-Deployment

### 1. Environment Variables Setup

Copy these environment variables to your Vercel project:

**Required Variables:**
- [ ] `NEXT_PUBLIC_FETCH_URL`
- [ ] `NEXT_PUBLIC_DOMAIN_URL`
- [ ] `NEXT_PUBLIC_CAPTCHA_PUBLIC_KEY`
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

**Recommended Variables:**
- [ ] `SESSION_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] `NEXT_PUBLIC_POSTHOG_KEY`
- [ ] `NEXT_PUBLIC_POSTHOG_HOST`

### 2. Verify Build Locally

```bash
npm run build
npm run start
```

- [ ] Build completes without errors
- [ ] Application runs locally on port 8124

### 3. Code Quality Checks

```bash
npm run check-lint
npm run check-format
```

- [ ] No critical lint errors in new files
- [ ] Code formatting is correct

## Deployment Steps

### 1. Connect to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link
```

### 2. Deploy to Preview

```bash
# Deploy to preview environment
vercel
```

- [ ] Preview deployment succeeds
- [ ] Preview URL is accessible

### 3. Test Preview Deployment

Visit your preview URL and verify:

- [ ] Homepage loads correctly
- [ ] Restaurant list displays
- [ ] Menu pages work
- [ ] Cart functionality works
- [ ] Login/Register works
- [ ] Checkout flow works
- [ ] Google Maps loads
- [ ] Atlas chat widget appears (when logged in)
- [ ] PostHog tracking works
- [ ] No console errors

### 4. Check Security Headers

Use [securityheaders.com](https://securityheaders.com) with your preview URL:

- [ ] Strict-Transport-Security header present
- [ ] X-Frame-Options header present
- [ ] X-Content-Type-Options header present
- [ ] Content-Security-Policy header present
- [ ] Referrer-Policy header present

### 5. Performance Testing

Use [PageSpeed Insights](https://pagespeed.web.dev/) or Lighthouse:

- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Performance score > 80

### 6. Check Sitemap

- [ ] Visit `/sitemap.xml` - should display XML sitemap
- [ ] Visit `/robots.txt` - should reference sitemap URL

### 7. Deploy to Production

```bash
# Deploy to production
vercel --prod
```

- [ ] Production deployment succeeds
- [ ] Production URL is accessible

## Post-Deployment

### 1. Verify Production

- [ ] All features work in production
- [ ] Security headers are present
- [ ] Sitemap is accessible
- [ ] Analytics tracking works
- [ ] Error tracking (Sentry) works

### 2. Monitor Performance

Check these services:

- [ ] **Vercel Dashboard**: Check build logs and function invocations
- [ ] **Sentry**: Verify error tracking is working
- [ ] **PostHog**: Check analytics events
- [ ] **Lighthouse**: Run performance audit

### 3. DNS and SSL

- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active
- [ ] HTTPS redirect works
- [ ] WWW redirect works (if configured)

### 4. Update Documentation

- [ ] Update README with new Vercel URL
- [ ] Document any environment-specific configurations
- [ ] Update team about deployment

## Rollback Plan

If issues arise:

```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

Or in Vercel Dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

## Performance Benchmarks

Record these metrics for future reference:

| Metric | Target | Actual |
|--------|--------|--------|
| Build Time | < 3 min | _____ |
| First Load JS | < 200 KB | _____ |
| LCP | < 2.5s | _____ |
| FID | < 100ms | _____ |
| CLS | < 0.1 | _____ |
| Security Headers Score | A+ | _____ |

## Common Issues

### Build Fails

- Check environment variables are set
- Verify all dependencies are in package.json
- Check build logs for specific errors

### CSP Blocks Resources

If Content Security Policy blocks resources:
- Check browser console for CSP violations
- Update CSP in `next.config.mjs` headers() function
- Add missing domains to appropriate directives

### Middleware Errors

- Check `middleware.js` matcher patterns
- Verify Edge runtime compatibility
- Review Vercel function logs

### Session Issues

- Verify `SESSION_SECRET` is set in production
- Check cookie settings in `lib/config.js`
- Ensure `secure: true` in production

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- Project-specific issues: See VERCEL_OPTIMIZATIONS.md

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Deployment URL**: _______________
**Notes**: _______________
