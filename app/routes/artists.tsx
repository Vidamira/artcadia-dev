import React from 'react';
import {useLoaderData, Link} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import Reveal from '~/components/animations/Reveal';

const blacklistedCollectionHandles = ['architecture', 'abstract', 'featured', 'paintings', 'figurative', 'portrait', 'photography', 'sculpture', 'landscapes', 'price-on-request', 'featured-artwork', 'the-team'];

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
    pageBy: 60,
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

export default function Artists() {
  const { collections, hasNextPage, fetchNextPage } = useLoaderData<typeof loader>();
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const observerRef = React.useRef(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
          setIsLoadingMore(true);
          fetchNextPage().then(() => setIsLoadingMore(false));
        }
      },
      { threshold: 0.5 } // Trigger fetch when 50% of element is visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage,   
 isLoadingMore]);

 React.useEffect(() => {
  const handleScroll = async () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (hasNextPage && scrollTop + clientHeight >= scrollHeight - 50) {
      setIsLoadingMore(true);
      await fetchNextPage();
      setIsLoadingMore(false);
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => window.removeEventListener('scroll', handleScroll);   

}, [hasNextPage, fetchNextPage]);

  return (
    <div className="collections p-8 mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      
        <h1>Artists</h1>
      

      <Pagination connection={collections}>
  {({ nodes, isLoading, PreviousLink, NextLink }) => (
    <div className="flex justify-between ">
      
    
        <CollectionsGrid collections={nodes} />
      
      {hasNextPage && (
        <div className="text-center mt-4">
          {isLoading ? 'Loading More...' : ' '}  {/* Empty element for spacing */}
        </div>
      )}
      
    </div>
  )}
</Pagination>
    </div>
  );
  
}

function CollectionsGrid({ collections }: { collections: CollectionFragment[] }) {
  const filteredCollections = collections.filter(
    (collection) => !blacklistedCollectionHandles.includes(collection.handle)
  );

  return (
    <div className="collections-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredCollections.map((collection, index) => (
        <CollectionItem key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
}

function CollectionItem({ collection, index }: { collection: CollectionFragment; index: number }) {
  return (
    <Reveal>
    <Link className="collection-item group bg-zinc-800 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105 ease-in-out" key={collection.id} to={`/collections/${collection.handle}`} prefetch="intent">
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
    </Reveal>
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
    $first: Int = 8  # Adjust the default value here
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
