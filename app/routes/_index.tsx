import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Pagination, getPaginationVariables,Image} from '@shopify/hydrogen';
import SwipeCarousel from '~/components/SwipeCarousel';
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from '~/components/animations/Reveal';
import Features from "~/components/Features";

import WelcomeGrid from '~/components/WelcomeGrid';
import TextParallaxContent from '~/components/TextParallaxContent';
import Slider from '~/components/Slider';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
  CollectionFragment,
} from 'storefrontapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
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
async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);   

  return {collections};

  
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}







export default function Homepage() {
  const { collections } = useLoaderData<typeof loader>();
  const features = [
    {
      id: 1,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide1.png?v=1724007349",
      subheading: "Public Spaces",
      heading: "Let's find the perfect piece for your space.",
    },
    {
      id: 2,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide2.png?v=1724007350",
      subheading: "Custom Art", 
      heading: "Dream it, own it. Commission unique artworks tailored to your vision.",
    },
    {
      id: 3,
      imgUrl: "https://cdn.shopify.com/s/files/1/0644/6075/1013/files/slide3.png?v=1724007350",
      subheading: "Global Reach",
      heading: "Artcadia delivers worldwide, bringing the world's finest art to your home.",
    },
    // ... other features
  ];

  return (
    <div className="container mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      <SwipeCarousel />
      <Reveal>
       
       <motion.div animate={{ x: 100 }} />
      <WelcomeGrid />
      </Reveal>

      
      <Pagination connection={collections}>
        {({ nodes, isLoading, PreviousLink, NextLink }) => (
          <div className="flex justify-between p-8">
            <Reveal>
            <CollectionsGrid collections={nodes} />
            </Reveal>
          </div>
        )}
      </Pagination>
      <Features features={features} />
    </div>
  );
}

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
    <Link className="collection-item group bg-zinc-900 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105 ease-in-out" key={collection.id} to={`/collections/${collection.handle}`} prefetch="intent">
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          className="group-hover:opacity-75" // Hover styles for image
        />
      )}
      <div className="p-4">
        <h5 className="font-semibold text-zinc-100"> {collection.title}</h5>
        
        {/* Truncate description to 50 characters and add ellipsis if needed */}
      </div>
    </Link>
  );
}



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
  query StoreCollections(
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
` as const;
