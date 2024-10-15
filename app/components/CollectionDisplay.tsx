import { useLoaderData, Link } from '@remix-run/react';
import { Image, Money } from '@shopify/hydrogen';
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, Suspense } from 'react';
import type { ProductItemFragment } from 'storefrontapi.generated';

// GraphQL query for the featured collection
const FEATURED_COLLECTION_QUERY = `#graphql
  query GetFeaturedCollection {
    collection(handle: "featured-artwork") {
      id
      title
      description
      products(first: 10) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
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
      }
    }
  }
`;

// Loader function to fetch the featured collection
export async function loader(args: LoaderFunctionArgs) {
  const { storefront } = args.context;
  
  // Fetch the featured collection
  const { collection: featuredCollection } = await storefront.query(FEATURED_COLLECTION_QUERY, {
    variables: { handle: 'featured-artwork' },
  });

  if (!featuredCollection) {
    throw new Response('Featured collection not found', { status: 404 });
  }

  return defer({ featuredCollection });
}

export default function CollectionDisplay() {
  const { featuredCollection } = useLoaderData<typeof loader>();

  if (!featuredCollection) {
    return <p>Collection not found</p>;
  }

  return (
    <div className="collection mx-auto bg-zinc-950 text-zinc-100 p-8">
      <h1 className="text-3xl font-bold mb-6">{featuredCollection.title}</h1>
      <p className="text-lg text-zinc-500 mb-8">{featuredCollection.description}</p>

      <Suspense fallback={<p>Loading products...</p>}>
        <Await resolve={featuredCollection}>
          {({ products }) => <ProductsGrid products={products.nodes} />}
        </Await>
      </Suspense>
    </div>
  );
}

// ProductsGrid Component (Reused from collections.$handle.tsx)
function ProductsGrid({ products }: { products: ProductItemFragment[] }) {
  return (
    <div className="products-grid grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
      ))}
    </div>
  );
}

// ProductItem Component (Reused from collections.$handle.tsx)
function ProductItem({ product, loading }: { product: ProductItemFragment; loading?: 'eager' | 'lazy' }) {
  const variant = product.variants.nodes[0];
  const variantUrl = `/products/${product.handle}`; // Adjust the product URL

  return (
    <div className="product-item bg-zinc-900 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105">
      <Link
        className="product-item bg-zinc-800 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105"
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
            className="object-cover"
          />
        )}
        <div className="p-2">
          <h4 className="text-1xl">{product.title}</h4>
          <small>
            <Money data={product.priceRange.minVariantPrice} />
          </small>
        </div>
      </Link>
    </div>
  );
}
