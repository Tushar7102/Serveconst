import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, Grid, List, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import ProductCard from '../components/ProductCard';
import { featuredProducts } from '../data/mockData';

const ProductListingPage = ({ category, searchQuery, onProductClick, onAddToCart, onWishlist }) => {
  const [products, setProducts] = useState(featuredProducts);
  const [filteredProducts, setFilteredProducts] = useState(featuredProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    rating: [],
    delivery: [],
    discount: [],
    categories: []
  });

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'discount', label: 'Discount' }
  ];

  const filterOptions = {
    rating: [
      { value: '4+', label: '4★ & above', count: 234 },
      { value: '3+', label: '3★ & above', count: 456 },
      { value: '2+', label: '2★ & above', count: 567 }
    ],
    delivery: [
      { value: 'free', label: 'Free Delivery', count: 189 },
      { value: 'fast', label: 'Fast Delivery', count: 123 }
    ],
    discount: [
      { value: '50+', label: '50% or more', count: 145 },
      { value: '40+', label: '40% or more', count: 234 },
      { value: '30+', label: '30% or more', count: 345 }
    ]
  };

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = filtered.filter(product => product.category === category.name);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating.length > 0) {
      filtered = filtered.filter(product => {
        return filters.rating.some(rating => {
          const minRating = parseFloat(rating.replace('+', ''));
          return product.rating >= minRating;
        });
      });
    }

    // Apply delivery filter
    if (filters.delivery.includes('free')) {
      filtered = filtered.filter(product => product.freeDelivery);
    }

    // Apply discount filter
    if (filters.discount.length > 0) {
      filtered = filtered.filter(product => {
        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        return filters.discount.some(discount => {
          const minDiscount = parseInt(discount.replace('+', ''));
          return discountPercent >= minDiscount;
        });
      });
    }

    // Sort products
    switch (sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = Math.round(((a.originalPrice - a.price) / a.originalPrice) * 100);
          const discountB = Math.round(((b.originalPrice - b.price) / b.originalPrice) * 100);
          return discountB - discountA;
        });
        break;
      default:
        // Keep relevance order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, category, searchQuery, filters, sortBy]);

  const handleFilterChange = (filterType, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      rating: [],
      delivery: [],
      discount: [],
      categories: []
    });
  };

  const FilterSection = ({ title, options, filterType }) => (
    <div className="mb-6">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="space-y-2">
        {options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterType}-${option.value}`}
              checked={filters[filterType].includes(option.value)}
              onCheckedChange={(checked) => handleFilterChange(filterType, option.value, checked)}
            />
            <label 
              htmlFor={`${filterType}-${option.value}`}
              className="text-sm text-gray-600 flex-1 cursor-pointer"
            >
              {option.label}
            </label>
            <span className="text-xs text-gray-400">({option.count})</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {category ? category.name : searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View mode toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="rounded-none"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {showFilters && (
            <Card className="w-80 p-6 h-fit sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={handlePriceRangeChange}
                    max={5000}
                    min={0}
                    step={100}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <FilterSection
                title="Customer Rating"
                options={filterOptions.rating}
                filterType="rating"
              />

              <FilterSection
                title="Delivery"
                options={filterOptions.delivery}
                filterType="delivery"
              />

              <FilterSection
                title="Discount"
                options={filterOptions.discount}
                filterType="discount"
              />
            </Card>
          )}

          {/* Products grid/list */}
          <div className="flex-1">
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
                : 'space-y-4'
            }>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onProductClick={onProductClick}
                  onAddToCart={onAddToCart}
                  onWishlist={onWishlist}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <Card className="p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;