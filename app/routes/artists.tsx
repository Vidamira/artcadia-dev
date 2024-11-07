import React from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type { CollectionFragment, Metafield } from 'storefrontapi.generated';

const blacklistedCollectionHandles = [
  'architecture',
  'abstract',
  'slider',
  'featured',
  'paintings',
  'figurative',
  'portrait',
  'photography',
  'sculpture',
  'landscapes',
  'price-on-request',
  'featured-artwork',
  'the-team',
];

export async function loader(args: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(args.request, {
    pageBy: 65,
  });

  const { collections } = await args.context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return defer({ collections });
}

export default function Artists() {
  const { collections } = useLoaderData<typeof loader>();

  // Ensure collections.nodes exists and is an array
  const collectionNodes = Array.isArray(collections?.nodes) ? collections.nodes : [];

  // Filter out blacklisted collections
  const filteredCollections = collectionNodes.filter(
    (collection) => !blacklistedCollectionHandles.includes(collection.handle)
  );

  // Group collections by artist type (using the metafield)
  const groupedCollections = filteredCollections.reduce((acc: Record<string, CollectionFragment[]>, collection) => {
    const artistTypeMetafield = collection.metafields?.find(
      (mf: Metafield) => mf.key === 'artist_type'
    );
    const artistType = artistTypeMetafield?.value || 'Unknown';

    if (!acc[artistType]) {
      acc[artistType] = [];
    }
    acc[artistType].push(collection);
    return acc;
  }, {});

  return (
    <div className="collections p-4 mx-auto max-w-7xl bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid grid-cols-1 gap-8 pb-20 pt-12 md:grid-cols-12">
        <h2 className="col-span-1 text-3xl font-bold md:col-span-4">
          Explore a World of Artistic Expression
        </h2>
        <div className="col-span-1 md:col-span-8">
          <p className="mb-4 text-xl text-zinc-400 font-light md:text-2xl">
            Each of our artists offers a unique perspective and style, creating a
            gallery of truly one-of-a-kind pieces. From bold and abstract to delicate
            and intricate, there is something here for every art lover.
          </p>
        </div>
      </div>

      {/* Loop through each artist type and display collections */}
      {Object.entries(groupedCollections).map(([artistType, collections]) => (
        <div key={artistType} className="artist-group mb-8">
          <h3 className="text-2xl font-semibold mb-4">{artistType}</h3>
          <CollectionsGrid collections={collections} />
        </div>
      ))}
    </div>
  );
}

function CollectionsGrid({ collections }: { collections: CollectionFragment[] }) {
  return (
    <div className="collections-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {collections.map((collection, index) => (
        <CollectionItem key={collection.id} collection={collection} index={index} />
      ))}
    </div>
  );
}

function CollectionItem({ collection, index }: { collection: CollectionFragment; index: number }) {
  const artistType = collection.metafields?.find((mf: Metafield) => mf.key === 'artist_type')?.value || 'Unknown';

  return (
    <Link
      className="collection-item group bg-zinc-800 text-zinc-100 rounded overflow-hidden shadow-md transition duration-300 hover:scale-105 ease-in-out"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          className="object-cover group-hover:opacity-75"
        />
      )}
      <div className="p-4">
        <h5 className="font-semibold text-zinc-100">{collection.title}</h5>
        {/* Display the artist_type tag */}
        <div className="mt-2 text-sm text-zinc-400 bg-zinc-700 inline-block px-2 py-1 rounded-full">
          {artistType}
        </div>
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
    metafields(identifiers: [{namespace: "custom", key: "artist_type"}]) {
      key
      value
    }
  }
  query StoreCollections2(
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
