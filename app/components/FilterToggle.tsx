import React, { useState } from 'react';

const FilterToggle = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
    onFilterChange(event.target.value); // Call the filtering function
  };

  return (
    <div className="filter-toggle">
      <select value={selectedFilter} onChange={handleFilterChange}>
        <option value="">-- Select Filter --</option>
        <option value="price">Price (Low to High)</option>
        <option value="alphabetical">A-Z</option>
        
      </select>
    </div>
  );
};

export default FilterToggle;