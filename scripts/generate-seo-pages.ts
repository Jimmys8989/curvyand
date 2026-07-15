import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BRANDS } from "../src/data";
import {
  DEFAULT_OG_IMAGE,
  SITE_URL,
  getIndexableRoutes,
  getSeoForPath,
  type SeoConfig,
} from "../src/seo";

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, "dist");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const navigation = `
  <nav aria-label="Primary">
    <a href="/">Home</a>
    <a href="/size-converter">Plus-Size Converter</a>
    <a href="/brand-directory">Brand Directory</a>
  </nav>`;

function brandLinks(limit = BRANDS.length) {
  return BRANDS.slice(0, limit)
    .map(
      (brand) =>
        `<li><a href="/brand-directory/${escapeHtml(brand.id)}">${escapeHtml(brand.name)} size chart and fit guide</a></li>`,
    )
    .join("");
}

function converterLinks(limit = BRANDS.length) {
  return BRANDS.slice(0, limit)
    .map(
      (brand) =>
        `<li><a href="/size-converter-${escapeHtml(brand.id)}">${escapeHtml(brand.name)} size converter</a></li>`,
    )
    .join("");
}

function renderSeoShell(seo: SeoConfig): string {
  const start = `<main data-seo-shell class="max-w-4xl mx-auto px-4 py-12 space-y-6">${navigation}`;
  const end = `<p><a href="/terms-and-privacy">Terms and privacy</a></p></main>`;

  if (seo.pageKind === "home") {
    return `${start}
      <h1>Plus-Size Brand Size Converter</h1>
      <p>${escapeHtml(seo.description)}</p>
      <section>
        <h2>Find your size by brand</h2>
        <p>Start with your bust, waist, and hip measurements or translate a size you already wear.</p>
        <ul>${converterLinks(12)}</ul>
      </section>
      <section>
        <h2>Explore plus-size brand fit guides</h2>
        <ul>${brandLinks(12)}</ul>
      </section>${end}`;
  }

  if (seo.pageKind === "directory") {
    return `${start}
      <h1>Plus-Size Brand Directory</h1>
      <p>${escapeHtml(seo.description)}</p>
      <p>Each guide includes a sizing range, garment measurement chart, and practical fit notes.</p>
      <ul>${brandLinks()}</ul>${end}`;
  }

  if (seo.pageKind === "brand" && seo.brand) {
    const brand = seo.brand;
    return `${start}
      <p><a href="/brand-directory">Brand Directory</a> / ${escapeHtml(brand.name)}</p>
      <article>
        <h1>${escapeHtml(brand.name)} Size Chart and Fit Guide</h1>
        <p>${escapeHtml(brand.description)}</p>
        <h2>${escapeHtml(brand.name)} sizing overview</h2>
        <p>Available sizing range: ${escapeHtml(brand.sizingRange)}.</p>
        <h2>Curated fit notes</h2>
        <p>${escapeHtml(brand.fitNotes)}</p>
        <p><a href="/size-converter-${escapeHtml(brand.id)}">Use the ${escapeHtml(brand.name)} size converter</a></p>
      </article>${end}`;
  }

  if (seo.pageKind === "comparison" && seo.sourceBrand && seo.targetBrand) {
    return `${start}
      <p><a href="/size-converter">Size Converter</a> / Brand comparison</p>
      <h1>${escapeHtml(seo.sourceBrand.name)} to ${escapeHtml(seo.targetBrand.name)} Size Converter</h1>
      <p>${escapeHtml(seo.description)}</p>
      <h2>How the conversion works</h2>
      <p>Select the ${escapeHtml(seo.sourceBrand.name)} size and garment category you already wear. Curvy& compares its measurement range with ${escapeHtml(seo.targetBrand.name)} to suggest the closest available size.</p>
      <ul>
        <li><a href="/brand-directory/${escapeHtml(seo.sourceBrand.id)}">${escapeHtml(seo.sourceBrand.name)} size and fit guide</a></li>
        <li><a href="/brand-directory/${escapeHtml(seo.targetBrand.id)}">${escapeHtml(seo.targetBrand.name)} size and fit guide</a></li>
      </ul>${end}`;
  }

  if (seo.pageKind === "converter") {
    if (seo.targetBrand) {
      return `${start}
        <p><a href="/size-converter">Size Converter</a> / ${escapeHtml(seo.targetBrand.name)}</p>
        <h1>${escapeHtml(seo.targetBrand.name)} Size Converter</h1>
        <p>${escapeHtml(seo.description)}</p>
        <h2>Measurements used</h2>
        <p>Enter your bust, waist, and hip measurements, select a garment category, and compare the result with the brand chart before ordering.</p>
        <p><a href="/brand-directory/${escapeHtml(seo.targetBrand.id)}">Read the ${escapeHtml(seo.targetBrand.name)} size chart and fit guide</a></p>${end}`;
    }

    return `${start}
      <h1>Free Plus-Size Clothing Size Converter by Brand</h1>
      <p>${escapeHtml(seo.description)}</p>
      <h2>Choose a brand size converter</h2>
      <ul>${converterLinks()}</ul>${end}`;
  }

  if (seo.pageKind === "legal") {
    return `${start}
      <h1>Terms of Service and Privacy Policy</h1>
      <p>${escapeHtml(seo.description)}</p>
      <p>Size recommendations are informational estimates. Always compare the recommendation with the retailer's current product-specific chart before purchasing.</p>${end}`;
  }

  return `${start}<h1>Page not found</h1><p>The requested page could not be found.</p>${end}`;
}

function applyMetadata(template: string, seo: SeoConfig): string {
  const fullUrl = `${SITE_URL}${seo.canonicalPath}`;
  const title = escapeHtml(seo.title);
  const description = escapeHtml(seo.description);
  const robots = seo.robots ?? "index,follow";
  const ogType = seo.ogType ?? "website";
  const ogImage = seo.ogImage ?? DEFAULT_OG_IMAGE;
  const schema = seo.schema
    ? `<script id="seo-static-schema" type="application/ld+json">${JSON.stringify(seo.schema).replaceAll("<", "\\u003c")}</script>`
    : "";

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta name="robots"[^>]*>/, `<meta name="robots" content="${robots}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${fullUrl}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${ogType}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${fullUrl}" />`)
    .replace(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${ogImage}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`)
    .replace(/<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${ogImage}" />`)
    .replace("</head>", `    ${schema}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderSeoShell(seo)}</div>`);
}

function routeOutputPath(route: string): string {
  if (route === "/") return path.join(distDir, "index.html");
  return path.join(distDir, `${route.slice(1)}.html`);
}

async function main() {
  const template = await readFile(path.join(distDir, "index.html"), "utf8");
  const routes = getIndexableRoutes(BRANDS);

  for (const route of routes) {
    const seo = getSeoForPath(route, BRANDS);
    const outputPath = routeOutputPath(route);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, applyMetadata(template, seo));
  }

  const notFoundSeo = getSeoForPath("/404", BRANDS);
  await writeFile(path.join(distDir, "404.html"), applyMetadata(template, notFoundSeo));

  const converterFallbackSeo: SeoConfig = {
    ...getSeoForPath("/size-converter", BRANDS),
    robots: "noindex,follow",
  };
  await writeFile(
    path.join(distDir, "_converter-fallback.html"),
    applyMetadata(template, converterFallbackSeo),
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map((route) => `  <url><loc>${SITE_URL}${route}</loc></url>`)
    .join("\n")}\n</urlset>\n`;

  await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
  await writeFile(path.join(projectRoot, "public", "sitemap.xml"), sitemap);
  console.log(`Generated ${routes.length} indexable SEO pages and sitemap entries.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
