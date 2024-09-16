import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
  Analytics,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import { motion } from 'framer-motion';
import BackArrow from '~/components/BackArrow';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collection() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <div className="collection mx-auto bg-zinc-950 text-zinc-100 flex flex-col md:flex-col md:max-w-7xl md:items-center md:gap-8 p-8">
        <div className='flex w-full justify-start'>
        <BackArrow />
        </div>
        <div className="flex flex-col md:flex-row space-y-4  md:">
         
          <div className=' flex flex-col md:order md:flex-row-reverse  md:max-h-64'>
            {collection?.image && (
              <Image
                alt={collection.image.altText || collection.title}
                aspectRatio="1/1"
                width={400} // Adjust width as needed
                height={400} // Maintain square aspect ratio
                data={collection.image}
                loading="eager" // Ensure eager loading for the main image
                className="object-cover object-center rounded-lg shadow-md overflow-hidden w-full md:w-1/2 lg:w-1/3" // Use Tailwind classes
              />
            )}
            <div className='flex-col mb-5 md:mb-0 mr-5'>
            <h1 className='font-medium text-3xl mb-2 sm: mt-4 '>{collection.title}</h1>
            <p className="collection-description md: max-w-7xl text-zinc-500">{collection.description}</p> 
            </div>
          </div>
          
       
      </div>
      
      <div className="flex flex-col space-y-4">
        
        <Pagination connection={collection.products}>
          {({ nodes, isLoading, PreviousLink, NextLink }) => (
            <>
              
              <ProductsGrid products={nodes} />
              <br />
              <NextLink className="text-zinc-950 bg-zinc-100 rounded mx-auto w-full text-center p-4 hover:scale-105 transition-transform duration-300 ease-in-out">
                {isLoading ? 'Loading...' : (
                  <span className='font-medium'>Load more ↓</span>
                )}
              </NextLink>
            </>
          )}
        </Pagination>
      </div>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
      
    </div>
  );
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

function ProductItem({ product, loading, vendor }: { product: ProductItemFragment; loading?: 'eager' | 'lazy'; vendor?: VendorType }) {
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
            sizes="(min-width: 45em) 400px,   
 100vw"
            className="object-cover"   

          />
        )}
        <div className="p-2 text-zinc-100">
          <h4 className="text-1xl">{product.title}</h4>
          <small>
            <Money data={product.priceRange.minVariantPrice} />
          </small>
          {vendor && ( // Conditionally render vendor details if available
            <div className="flex items-center mt-2">
              <p className="text-sm mr-2">By:</p>
              <Link to={`/vendors/${vendor.handle}`} className="font-medium text-zinc-300 hover:underline">
                {vendor.name}
              </Link>
            </div>
          )}
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
