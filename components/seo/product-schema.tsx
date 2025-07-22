interface ProductSchemaProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
    category: string;
    brand?: string;
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "SSCreation"
    },
    "category": product.category,
    "image": product.image,
    "url": `https://sscreation.com/products/${product.id}`,
    "offers": {
      "@type": "Offer",
      "price": product.discountPrice || product.price,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SSCreation"
      },
      ...(product.discountPrice && {
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": product.discountPrice,
          "priceCurrency": "INR",
          "referencePrice": {
            "@type": "UnitPriceSpecification",
            "price": product.price,
            "priceCurrency": "INR"
          }
        }
      })
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

interface BundleSchemaProps {
  bundle: {
    id: string;
    name: string;
    description: string;
    originalPrice: number;
    discountPrice?: number;
    image: string;
    products: Array<{
      id: string;
      title: string;
    }>;
  };
}

export function BundleSchema({ bundle }: BundleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProductCollection",
    "name": bundle.name,
    "description": bundle.description,
    "brand": {
      "@type": "Brand",
      "name": "SSCreation"
    },
    "image": bundle.image,
    "url": `https://sscreation.com/bundles/${bundle.id}`,
    "offers": {
      "@type": "Offer",
      "price": bundle.discountPrice || bundle.originalPrice,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "SSCreation"
      }
    },
    "hasPart": bundle.products.map(product => ({
      "@type": "Product",
      "name": product.title,
      "url": `https://sscreation.com/products/${product.id}`
    })),
    "numberOfItems": bundle.products.length
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}