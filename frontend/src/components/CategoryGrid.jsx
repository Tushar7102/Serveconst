import React from 'react';
import { Card } from './ui/card';

const CategoryGrid = ({ categories, onCategoryClick }) => {
  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-sm"
              onClick={() => onCategoryClick && onCategoryClick(category)}
            >
              <div className="p-4 text-center">
                <div className="mb-3 overflow-hidden rounded-lg">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-20 object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                  {category.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;