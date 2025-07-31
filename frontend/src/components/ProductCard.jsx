import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ProductCard = ({ product, onProductClick, onAddToCart, onWishlist }) => {
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-sm relative group">
      {/* Wishlist button */}
      <button 
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onWishlist && onWishlist(product);
        }}
      >
        <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
      </button>

      <div onClick={() => onProductClick && onProductClick(product)}>
        {/* Product image */}
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 md:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Discount badge */}
          {discountPercent > 0 && (
            <Badge className="absolute top-3 left-3 bg-green-500 text-white font-semibold">
              {discountPercent}% OFF
            </Badge>
          )}

          {/* Free delivery badge */}
          {product.freeDelivery && (
            <Badge className="absolute bottom-3 left-3 bg-blue-500 text-white text-xs">
              Free Delivery
            </Badge>
          )}
        </div>

        {/* Product details */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Price section */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Rating and reviews */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {product.rating}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Seller and delivery info */}
          <div className="text-xs text-gray-600 mb-3">
            <div>By {product.seller}</div>
            <div className="text-green-600 font-medium">
              Delivery in {product.deliveryTime}
            </div>
          </div>
        </div>
      </div>

      {/* Add to cart button */}
      <div className="px-4 pb-4">
        <Button 
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart && onAddToCart(product);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
};

export default ProductCard;