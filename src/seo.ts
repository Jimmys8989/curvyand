import type { Brand } from "./types";

export const SITE_URL = "https://www.curvyand.com";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/curvy-brand-icon.png`;

export const SEO_COMPARISON_PAIRS: Array<[string, string]> = [
  ["torrid", "lane-bryant"],
  ["lane-bryant", "torrid"],
  ["torrid", "eloquii"],
  ["eloquii", "torrid"],
  ["torrid", "universal-standard"],
  ["universal-standard", "torrid"],
  ["asos-curve", "torrid"],
  ["old-navy", "torrid"],
  ["lane-bryant", "eloquii"],
  ["good-american", "torrid"],
];

export interface SeoConfig {
  title: string;
  description: string;
  canonicalPath: string;
  ogType?: "website" | "article";
  ogImage?: string;
  robots?: "index,follow" | "noindex,follow";
  schema?: Record<string, unknown> | Record<string, unknown>[];
  pageKind:
    | "home"
    | "directory"
    | "brand"
    | "converter"
    | "comparison"
    | "about"
    | "legal"
    | "not-found";
  brand?: Brand;
  sourceBrand?: Brand;
  targetBrand?: Brand;
}

const breadcrumbs = (items: Array<{ name: string; path: string }>) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

const webApplicationSchema = (
  name: string,
  description: string,
  canonicalPath: string,
) => ({
  "@type": "WebApplication",
  "@id": `${SITE_URL}${canonicalPath}#webapp`,
  url: `${SITE_URL}${canonicalPath}`,
  name,
  description,
  applicationCategory: "UtilityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
});

export function parseComparisonPath(path: string, brands: Brand[]) {
  const prefix = "/size-converter/";
  if (!path.startsWith(prefix)) return null;

  const pair = path.slice(prefix.length);
  for (const sourceBrand of brands) {
    const sourcePrefix = `${sourceBrand.id}to`;
    if (!pair.startsWith(sourcePrefix)) continue;

    const targetId = pair.slice(sourcePrefix.length);
    const targetBrand = brands.find((brand) => brand.id === targetId);
    if (targetBrand) {
      return { sourceBrand, targetBrand };
    }
  }
  return null;
}

export function getSeoForPath(path: string, brands: Brand[]): SeoConfig {
  const normalizedPath = path === "/index.html" || !path ? "/" : path;

  if (normalizedPath === "/") {
    const description =
      "Convert plus-size clothing sizes across leading fashion brands using bust, waist, and hip measurements, then explore curated brand fit notes and size charts.";
    return {
      title: "Plus-Size Brand Size Converter & Fit Directory | Curvy&",
      description,
      canonicalPath: "/",
      pageKind: "home",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${SITE_URL}/#website`,
            url: `${SITE_URL}/`,
            name: "Curvy&",
            description,
            publisher: { "@id": `${SITE_URL}/#organization` },
          },
          {
            "@type": "Organization",
            "@id": `${SITE_URL}/#organization`,
            name: "Curvy&",
            url: `${SITE_URL}/`,
            logo: {
              "@type": "ImageObject",
              url: DEFAULT_OG_IMAGE,
              width: 512,
              height: 512,
            },
          },
        ],
      },
    };
  }

  if (normalizedPath === "/brand-directory") {
    const description =
      "Browse curated plus-size clothing brands, size ranges, measurement charts, category filters, and practical fit notes before you shop.";
    return {
      title: "Plus-Size Brand Directory, Size Charts & Fit Notes | Curvy&",
      description,
      canonicalPath: normalizedPath,
      pageKind: "directory",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": `${SITE_URL}${normalizedPath}#collection`,
            url: `${SITE_URL}${normalizedPath}`,
            name: "Curvy& Plus-Size Brand Directory",
            description,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: brands.map((brand, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: brand.name,
                url: `${SITE_URL}/brand-directory/${brand.id}`,
              })),
            },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Brand Directory", path: normalizedPath },
          ]),
        ],
      },
    };
  }

  const brandMatch = normalizedPath.match(/^\/brand-directory\/([^/]+)$/);
  if (brandMatch) {
    const brand = brands.find((item) => item.id === brandMatch[1]);
    if (brand) {
      const canonicalPath = `/brand-directory/${brand.id}`;
      const description = `${brand.name} plus-size chart, sizing range, garment measurements, and curated fit notes. Compare your measurements before choosing a size.`;
      return {
        title: `${brand.name} Size Chart, Sizing & Fit Guide | Curvy&`,
        description,
        canonicalPath,
        ogType: "article",
        pageKind: "brand",
        brand,
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${SITE_URL}${canonicalPath}#webpage`,
              url: `${SITE_URL}${canonicalPath}`,
              name: `${brand.name} Size Chart and Fit Guide`,
              description,
              about: {
                "@type": "Brand",
                name: brand.name,
                url: brand.siteUrl,
              },
              isPartOf: { "@id": `${SITE_URL}/#website` },
            },
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Brand Directory", path: "/brand-directory" },
              { name: brand.name, path: canonicalPath },
            ]),
          ],
        },
      };
    }
  }

  if (normalizedPath === "/size-converter") {
    const description =
      "Use bust, waist, and hip measurements to find a recommended plus-size clothing size, or translate a known size from one fashion brand to another.";
    return {
      title: "Free Plus-Size Clothing Size Converter by Brand | Curvy&",
      description,
      canonicalPath: normalizedPath,
      pageKind: "converter",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          webApplicationSchema("Curvy& Plus-Size Brand Size Converter", description, normalizedPath),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Size Converter", path: normalizedPath },
          ]),
        ],
      },
    };
  }

  const measurementMatch = normalizedPath.match(/^\/size-converter-([^/]+)$/);
  if (measurementMatch) {
    const brand = brands.find((item) => item.id === measurementMatch[1]);
    if (brand) {
      const canonicalPath = `/size-converter-${brand.id}`;
      const description = `Enter your bust, waist, and hip measurements to find a recommended ${brand.name} plus-size clothing size and review practical fit notes.`;
      return {
        title: `${brand.name} Size Converter & Measurement Fit Tool | Curvy&`,
        description,
        canonicalPath,
        pageKind: "converter",
        targetBrand: brand,
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            webApplicationSchema(`${brand.name} Size Converter`, description, canonicalPath),
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Size Converter", path: "/size-converter" },
              { name: brand.name, path: canonicalPath },
            ]),
          ],
        },
      };
    }
  }

  const comparison = parseComparisonPath(normalizedPath, brands);
  if (comparison) {
    const { sourceBrand, targetBrand } = comparison;
      const canonicalPath = `/size-converter/${sourceBrand.id}to${targetBrand.id}`;
      const isCuratedComparison = SEO_COMPARISON_PAIRS.some(
        ([source, target]) => source === sourceBrand.id && target === targetBrand.id,
      );
      const description = `Translate a known ${sourceBrand.name} plus-size clothing size into a recommended ${targetBrand.name} size using comparable garment measurements.`;
      return {
        title: `${sourceBrand.name} to ${targetBrand.name} Size Converter | Curvy&`,
        description,
        canonicalPath,
        robots: isCuratedComparison ? "index,follow" : "noindex,follow",
        pageKind: "comparison",
        sourceBrand,
        targetBrand,
        schema: {
          "@context": "https://schema.org",
          "@graph": [
            webApplicationSchema(
              `${sourceBrand.name} to ${targetBrand.name} Size Converter`,
              description,
              canonicalPath,
            ),
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Size Converter", path: "/size-converter" },
              {
                name: `${sourceBrand.name} to ${targetBrand.name}`,
                path: canonicalPath,
              },
            ]),
          ],
        },
      };
  }

  if (normalizedPath === "/terms-and-privacy") {
    const description =
      "Read the Curvy& terms of service, sizing disclaimer, privacy policy, and information about how measurement data is stored.";
    return {
      title: "Terms of Service & Privacy Policy | Curvy&",
      description,
      canonicalPath: normalizedPath,
      pageKind: "legal",
      schema: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        url: `${SITE_URL}${normalizedPath}`,
        name: "Curvy& Terms of Service and Privacy Policy",
        description,
      },
    };
  }

  if (normalizedPath === "/about") {
    const description =
      "Learn why Curvy& was created, how its plus-size sizing guidance is organized, and how community and external fit experiences are sourced and labeled.";
    return {
      title: "About Curvy& | Plus-Size Sizing Transparency",
      description,
      canonicalPath: normalizedPath,
      pageKind: "about",
      schema: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "AboutPage",
            url: `${SITE_URL}${normalizedPath}`,
            name: "About Curvy&",
            description,
            about: { "@id": `${SITE_URL}/#organization` },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "About Us", path: normalizedPath },
          ]),
        ],
      },
    };
  }

  return {
    title: "Page Not Found | Curvy&",
    description: "The requested Curvy& page could not be found.",
    canonicalPath: normalizedPath,
    robots: "noindex,follow",
    pageKind: "not-found",
  };
}

export function getIndexableRoutes(brands: Brand[]): string[] {
  const coreRoutes = ["/", "/size-converter", "/brand-directory", "/about", "/terms-and-privacy"];
  const brandRoutes = brands.map((brand) => `/brand-directory/${brand.id}`);
  const measurementRoutes = brands.map((brand) => `/size-converter-${brand.id}`);
  const comparisonRoutes = SEO_COMPARISON_PAIRS.map(
    ([source, target]) => `/size-converter/${source}to${target}`,
  );
  return [...coreRoutes, ...brandRoutes, ...measurementRoutes, ...comparisonRoutes];
}
