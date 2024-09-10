import React from 'react';
import { useLoaderData, Link } from '@remix-run/react';
import { Await, Suspense } from 'react';
import { Image } from '@shopify/hydrogen';

export const meta: any = () => {
  return [{ title: 'Hydrogen | Featured Collection' }];
};

export async function loader({ context, request }) {
  const { collections } = await context.storefront.query(GET_FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.edges.find(
    (edge) => edge.node.handle === 'featured-artwork'
  );

  if (!featuredCollection) {
    throw new Error('Featured collection not found');
  }

  return { featuredCollection: featuredCollection.node };
}

const GET_FEATURED_COLLECTION_QUERY = `#graphql
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
    products(first: 8) {
      edges {
        node {
          id
          title
          handle
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 1) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
        }
      }
    }
  }
  query FeaturedCollection {
    collections(first: 1, query: "{ handle: \\"featured-artwork\\" }") {
      edges {
        node {
          ...Collection
        }
      }
    }
  }
`;

const query = `
  query FeaturedCollection {
    collections(first: 1, query: "{ handle: \\"featured-artwork\\" }") {
      edges {
        node {
          ...Collection
        }
      }
    }
  }
`;

const { featuredCollection } = await context.storefront.query(query);

export default function FeaturedCollection() {
  const { featuredCollection } = useLoaderData<typeof loader>();

  if (!featuredCollection) {
    return <div>Loading featured collection...</div>;
  }

  return (
    <section className="featured-collection">
      <h2>{featuredCollection.title}</h2>
      <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-4">
        {featuredCollection.products.edges.map((edge) => (
          <Link
            key={edge.node.id}
            className="product-item group bg-white rounded overflow-hidden shadow-md transition duration-300 hover:scale-105 ease-in-out"
            to={`/products/${edge.node.handle}`}
            prefetch="intent"
          >
            {edge.node.images.edges.length > 0 && (
              <Image
                alt={edge.node.images.edges[0].node.altText || edge.node.title}
                aspectRatio="1/1"
                data={edge.node.images.edges[0].node}
                loading="eager"
                className="group-hover:opacity-75" // Hover styles for image
              />
            )}
            <div className="p-4">
              <h5 className="font-semibold text-gray-900">
                {edge.node.title}
              </h5>
              <span className="text-gray-600">
                {edge.node.variants.edges[0].node.priceV2.currencyCode}
                {edge.node.variants.edges[0].node.priceV2.amount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}