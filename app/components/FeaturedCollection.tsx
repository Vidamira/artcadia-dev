import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Collection, Product } from '@shopify/hydrogen/storefront-api-types';

const COLLECTION_BY_HANDLE_QUERY = `
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      title
      products(first: 8) {
        nodes {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          variants(first: 1) {
            nodes {
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ context }) => {
  const { storefront } = context;
  const handle = 'featured';

  const { data } = await storefront.query(COLLECTION_BY_HANDLE_QUERY, {
    variables: { handle },
  });

  if (!data?.collection) {
    throw new Response('Collection not found', { status: 404 });
  }

  return json({ collection: data.collection });
};

export function FeaturedCollection() {
  const { collection } = useLoaderData<{ collection: Collection }>();

  if (!collection) {
    return <p>Collection not found.</p>;
  }

  return (
    <div className="bg-zinc-950 text-zinc-100 p-8">
      <h2 className="text-3xl font-bold mb-6">{collection.title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collection.products.nodes.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { priceV2: price } = product.variants.nodes[0];

  return (
    <a href={`/products/${product.handle}`} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-zinc-800">
        {product.featuredImage && (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        )}
      </div>
      <h3 className="mt-4 text-sm text-zinc-300">{product.title}</h3>
      <p className="mt-1 text-lg font-medium text-zinc-100">
        {price.amount} {price.currencyCode}
      </p>
    </a>
  );
}
