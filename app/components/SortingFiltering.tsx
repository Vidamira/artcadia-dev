import React, { useState, useEffect } from 'react';
import type { ProductItemFragment } from 'storefrontapi.generated';
import ProductItem from './ProductItem'; // Assuming ProductItem is in the same directory

interface ProductsGridProps {
  products: ProductItemFragment[];
  sortBy: string | null;
  filters: {};
}

const SortingFiltering: React.FC<ProductsGridProps> = ({ products, sortBy, filters }) => {
  const [filteredProducts, setFilteredProducts] = useState<object[]>([]);

  useEffect(() => {
    const filteredData: object[] = applyFilters(products, filters);
    const sortedData = applySorting(filteredData, sortBy);
    setFilteredProducts(sortedData);
  }, [products, sortBy, filters]);

  const applyFilters = (products: ProductItemFragment[], filters: {}): object[] => {
    // Implement your filtering logic here based on the filters object
    // For example, you could filter by category, price range, etc.
    return products;
  };

  const applySorting = (products: object[], sortBy: string | null): object[] => {
    if (!sortBy) {
      return products;
    }

    return [...products].sort((a, b) => {
      if (sortBy === 'price_asc') {
        if (
          typeof a.priceRange?.minVariantPrice?.amount === 'number' &&
          typeof b.priceRange?.minVariantPrice?.amount === 'number'
        ) {
          return a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount;
        } else {
          // Handle non-numeric values (e.g., log an error or return a default value)
          return 0; // Or any default value you prefer
        }
      } else if (sortBy === 'price_desc') {
        if (
          typeof a.priceRange?.minVariantPrice?.amount === 'number' &&
          typeof b.priceRange?.minVariantPrice?.amount === 'number'
        ) {
          return b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount;
        } else {
          // Handle non-numeric values (e.g., log an error or return a default value)
          return 0; // Or any default value you prefer
        }
      } else if (sortBy === 'name_asc') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'name_desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  };

  return (
    <div className="products-grid grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
      {filteredProducts.map((product, index) => (
        <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
      ))}
    </div>
  );
};

export default SortingFiltering;