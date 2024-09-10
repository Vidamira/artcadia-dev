import React from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import {useVariantUrl} from '~/lib/variants';
import {
  Image,
  Money,
 
} from '@shopify/hydrogen';
import { type ProductItemFragment } from 'storefrontapi.generated';
import { motion } from 'framer-motion';

export default function FeaturedCollections({ handle }: { handle: string }) {
  
  const { collection } = useLoaderData<typeof loader>();

  if (!collection) {
    return <div>Collection not found</div>; // Handle missing collection
  }

  return <ProductsGrid products={collection.products.nodes || []} />;
}

function ProductsGrid({ products }: { products: ProductItemFragment[] }) {
  return (
    <div className="products-grid grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
      ))}
    </div>
  );
}

function ProductItem({ product, loading }: { product: ProductItemFragment; loading?: 'eager' | 'lazy' }) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <motion.div
      className="product-item bg-zinc-900 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105"
      initial="initial"
      animate="animate"
    >
        <Link
      className="product-item bg-zinc-800 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105 "
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      
        {product.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        )}
        <div className='p-2 text-zinc-100'>
          <h4 className='text-1xl'>{product.title}</h4>
          <small>
            <Money data={product.priceRange.minVariantPrice} />
          </small>
        </div>
      
      
      
    </Link>

    </motion.div>
      
    
    
  );
}


const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        id
        url
        altText
        width
        height
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;