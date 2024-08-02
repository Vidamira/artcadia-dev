import { useLoaderData, Link } from '@remix-run/react';


interface Category {
  id: string;
  title: string;
  handle: string;
  image: {
    id: string;
    url: string;
    width: number;
    height: number;
  };
}

export default function Categories() {
  const { categories } = useLoaderData<typeof loader>();

  return (
    <div className="categories-grid grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Display the categories */}
      {categories.map((category: Category) => (
        <Link
          key={category.id}
          to={`/categories/${category.handle}`}
          className="category-item rounded-lg shadow-md overflow-hidden group hover:shadow-lg"
        >
          <img src={category.image.url} alt={category.title} />
          {/* ... rest of your component */}
        </Link>
      ))}
    </div>
  );
}

export async function loader() {
  const categories = await fetchCategoriesFromShopify();
  return { categories };
}

async function fetchCategoriesFromShopify() {
  // Replace with your actual data fetching logic
  const response = await fetch('https://artcadia-gallery.myshopify.com/api/2023-10/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add necessary authorization headers
    },
    body: JSON.stringify({
      query: `
        query AllCategories {
          collections(first: 100) {
            nodes {
              id
              title
              handle
              image {
                id
                url
                width
                height
              }
            }
          }
        }
      `,
    }),
  });

  const data = await response.json();
  return data.data.collections.nodes;
}
