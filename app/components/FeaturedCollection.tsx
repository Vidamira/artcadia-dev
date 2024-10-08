import { useClient, useQuery } from '@shopify/hydrogen';
import { gql } from '@apollo/client/core';

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: {
      node: {
        url: string;
        altText: string;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        price: number;
        compareAtPrice: number | null;
      };
    }[];
  };
}

interface CollectionData {
  collectionByHandle: {
    products: {
      edges: {
        node: Product;
      }[];
    };
  };
}

const FEATURED_COLLECTION_QUERY = gql`
  query {
    collectionByHandle(handle: "featured") {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  price
                  compareAtPrice
                }
              }
            }
          }
        }
      }
    }
  }
`;

function FeaturedCollection() {
  const client = useClient();
  const { data, loading, error } = useQuery<CollectionData>(FEATURED_COLLECTION_QUERY, { client });
  
  interface ProductEdge {
    node: Product;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.collectionByHandle.products.edges.map((productEdge) => {
        const product = productEdge.node;
        return (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <img src={product.images.edges[0].node.url} alt={product.images.edges[0].node.altText} />
            <p>{product.description}</p>
            <p>Price: ${product.variants.edges[0].node.price}</p>
          </div>
        );
      })}
    </div>
  );
}

export default FeaturedCollection;