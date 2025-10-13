/**
 * Dynamic Sitemap Generator
 * Generates sitemap.xml for SEO
 * This runs on-demand for each request (getServerSideProps)
 */

function generateSiteMap() {
  const baseUrl = 'https://stonerspizza.app';
  const currentDate = new Date().toISOString();

  // Define static pages and their priorities
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
    { url: '/delivery', priority: '0.9', changefreq: 'daily' },
    { url: '/pickup', priority: '0.9', changefreq: 'daily' },
    { url: '/curbsidepickup', priority: '0.9', changefreq: 'daily' },
  ];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return sitemap;
}

export async function getServerSideProps({ res }) {
  // Generate the sitemap
  const sitemap = generateSiteMap();

  // Set response headers for XML
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  // Send the sitemap
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

// Default export to prevent Next.js errors
export default function Sitemap() {
  // This component is never rendered
  return null;
}
