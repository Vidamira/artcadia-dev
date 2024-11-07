import CollectionDisplay from '~/components/CollectionDisplay';
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, Link, type MetaFunction } from '@remix-run/react';
import { Suspense, useState } from 'react';
import { Pagination, getPaginationVariables, Image } from '@shopify/hydrogen';
import SwipeCarousel from '~/components/SwipeCarousel';
import { motion } from "framer-motion";
import Reveal from '~/components/animations/Reveal';
import WelcomeGrid from '~/components/WelcomeGrid';
import HomeCards from '~/components/HomeCards';
import type { CollectionFragment, ProductItemFragment } from 'storefrontapi.generated';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

      <div className="mx-auto grid grid-cols-1 gap-8 px-4 pb-24 pt-12 md:grid-cols-12">
            <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
              CATEGORIES
            </h2>
            <div className="col-span-1 md:col-span-8">
              <p className="mb-4 text-xl text-zinc-400 font-light md:text-2xl">
                At Artcadia, we offer more than just art. We aim to make your space feel like home, with our expertise, we help you plan and organize your space to make it fit for you.
              </p>
        
            </div>
     </div>

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
  const visibleProducts = 3; // Number of products visible at a time
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < products.length - visibleProducts) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative overflow-hidden p-4">
      <motion.div
        className="flex space-x-4"
        animate={{ x: -currentIndex * 300 }} // Adjust 300px based on product width
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[300px] bg-zinc-900 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105"
          >
            <ProductItemFeature product={product} />
          </div>
        ))}
      </motion.div>

      {/* Buttons container positioned below the product grid and aligned to the right */}
      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-zinc-800 text-zinc-100 p-2 rounded disabled:opacity-50"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= products.length - visibleProducts}
          className="bg-zinc-800 text-zinc-100 p-2 rounded disabled:opacity-50"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
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
