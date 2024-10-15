import CollectionDisplay from '~/components/CollectionDisplay';
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction } from '@remix-run/react';
import { Suspense } from 'react';
import { Pagination, getPaginationVariables, Image } from '@shopify/hydrogen';
import SwipeCarousel from '~/components/SwipeCarousel';
import { motion } from "framer-motion";
import Reveal from '~/components/animations/Reveal';
import WelcomeGrid from '~/components/WelcomeGrid';
import HomeCards from '~/components/HomeCards';
import type { CollectionFragment, ProductItemFragment } from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{ title: 'Hydrogen | Home' }];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Load critical data (collections + featured collection)
  const criticalData = await loadCriticalData(args);

  return defer({ ...deferredData, ...criticalData });
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  // Query all collections
  const collectionsPromise = context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  // Query the featured collection specifically
  const featuredCollectionPromise = context.storefront.query(FEATURED_COLLECTION_QUERY, {
    variables: { handle: 'featured-artwork', first: 8 },
  });

  const [{ collections }, { collection: featuredCollection }] = await Promise.all([
    collectionsPromise,
    featuredCollectionPromise,
  ]);

  return { collections, featuredCollection };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({ context }: LoaderFunctionArgs) {
  return {};
}

export default function Homepage() {
  const { collections, featuredCollection } = useLoaderData<typeof loader>();

  const cardData = [
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/02bild_jeff-1_1.png?v=1728472408",
      subheading: "Let's find the perfect piece for your space.",
      heading: "Public Spaces",
      customContent: {
        heading: "Elevate Your Space with Artcadia",
        description: "Find the perfect artwork to enhance your public space. Whether it's a hotel, restaurant, or office, our curated collections offer a wide range of styles and sizes to suit your unique needs.",
        buttonLabel: "Read more",
        buttonLink: "/public-spaces",
      },
    },
    {
      id: 2,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide5.png?v=1724007350",
      subheading: "Let's find the perfect piece for your space.",
      heading: "3D Exhibition",
      customContent: {
        heading: "Create Your Custom Artpiece",
        description: "Work with talented artists to design a one-of-a-kind artwork that perfectly complements your vision. Our custom art service ensures a personalized and memorable experience.",
        buttonLabel: "Read more",
        buttonLink: "https://art.kunstmatrix.com/apps/artspaces/dist/index.html?timestamp=1720601973336#/?external=true&uid=9442&exhibition=5924601",
      },
    },
  ];

  return (
    <div className="container mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      <SwipeCarousel />
      <Reveal>
        <motion.div animate={{ x: 100 }} />
        <WelcomeGrid />
      </Reveal>

      {/* Suspense ensures that we handle loading states for the featured collection */}
      <Suspense fallback={<p>Loading featured collection...</p>}>
        <Await resolve={featuredCollection}>
          {({ products }) => (
            <ProductsGridFeature products={products.edges.map(edge => edge.node)} />
          )}
        </Await>
      </Suspense>

      <Pagination connection={collections}>
        {({ nodes, isLoading, PreviousLink, NextLink }) => (
          <div className="flex justify-between p-8">
            <Reveal>
              <CollectionsGrid collections={nodes} />
            </Reveal>
          </div>
        )}
      </Pagination>

      <HomeCards cards={cardData} />
    </div>
  );
}

// Updated ProductsGrid for featured products
function ProductsGridFeature({ products }: { products: ProductItemFragment[] }) {
  return (
    <motion.div
      className="flex overflow-x-auto space-x-4 p-4"
      whileTap={{ cursor: "grabbing" }} // Adding grab effect on tap
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          className="min-w-[300px] flex-shrink-0 bg-zinc-900 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }} // Add a slight delay for each product
        >
          <ProductItemFeature product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
}


// Updated ProductItem for featured products
function ProductItemFeature({ product, loading }: { product: ProductItemFragment; loading?: 'eager' | 'lazy' }) {
  const variant = product.variants.nodes[0];
  const variantUrl = `/products/${product.handle}`;

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
        </div>
      </Link>
    </div>
  );
}

// CollectionsGrid for all collections (unchanged)
function CollectionsGrid({ collections }: { collections: CollectionFragment[] }) {
  return (
    <div className="collections-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
      {collections.map((collection, index) => (
        <CollectionItem key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
}

function CollectionItem({ collection, index }: { collection: CollectionFragment; index: number }) {
  return (
    <Link
      className="collection-item group bg-zinc-900 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105 ease-in-out"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          width={400}
          height={400}
          loading={index < 3 ? 'eager' : undefined}
          className="object-cover group-hover:opacity-75"
        />
      )}
      <div className="p-4">
        <h5 className="font-semibold text-zinc-100"> {collection.title}</h5>
      </div>
    </Link>
  );
}

// GraphQL queries
const FEATURED_COLLECTION_QUERY = `#graphql
 query GetFeaturedCollection {
  collection(handle: "Featured") {
    products(first: 10) {  # Adjust the number of products as needed
      edges {
        node {
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
}
`;


const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections3(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;
