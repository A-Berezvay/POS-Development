import React from 'react';


const CategoryTabs = ({ selectedCategory, onCategoryChange }) => {
  const categories = ['All', 'Drinks', 'Appetizers', 'Entrees'];

  return (
    <div className="category-tabs-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;