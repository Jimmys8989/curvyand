import React, { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string; // e.g. "/", "/size-converter", "/brand-directory", "/brand-directory/torrid"
  ogType?: "website" | "profile" | "product";
  ogImage?: string;
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title,
  description,
  canonicalPath,
  ogType = "website",
  ogImage = "https://www.curvyand.com/src/assets/images/curvy_brand_icon_1783559811096.jpg",
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // 3. Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    const fullUrl = `https://www.curvyand.com${canonicalPath}`;
    canonicalLink.setAttribute("href", fullUrl);

    // 4. Update Open Graph Meta Tags
    const ogTags = {
      "og:title": title,
      "og:description": description,
      "og:type": ogType,
      "og:url": fullUrl,
      "og:image": ogImage,
      "og:site_name": "Curvy&",
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 5. Update Twitter Card Meta Tags
    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": ogImage,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // 6. Dynamic JSON-LD Structured Data
    // Remove existing JSON-LD script from previous page render
    const existingScript = document.getElementById("seo-schema-script");
    if (existingScript) {
      existingScript.remove();
    }

    if (schema) {
      const script = document.createElement("script");
      script.id = "seo-schema-script";
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      // Clean up dynamic structured data script on unmount
      const script = document.getElementById("seo-schema-script");
      if (script) {
        script.remove();
      }
    };
  }, [title, description, canonicalPath, ogType, ogImage, schema]);

  return null;
}
