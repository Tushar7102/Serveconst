import React, { useState } from 'react';
import Banner from '../components/Banner';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Clock, TrendingUp, Flame, Gift } from 'lucide-react';
import { banners, categories, featuredProducts, deals } from '../data/mockData';

const HomePage = ({ onProductClick, onCategoryClick, onAddToCart, onWishlist }) => {
  const [currentDealTime, setCurrentDealTime] = useState("23:45:12");

  const DealSection = ({ deal, showTimer = false }) => (
    <Card className="bg-white p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {showTimer ? (
            <Fire className="h-6 w-6 text-red-500" />
          ) : (
            <TrendingUp className="h-6 w-6 text-pink-500" />
          )}
          <h2 className="text-2xl font-bold text-gray-800">{deal.title}</h2>
        </div>
        
        {showTimer && (
          <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-red-500" />
            <span className="text-red-600 font-semibold">{currentDealTime}</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {deal.products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            onWishlist={onWishlist}
          />
        ))}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <Banner banners={banners} />

      {/* Categories */}
      <CategoryGrid 
        categories={categories} 
        onCategoryClick={onCategoryClick} 
      />

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Special offers bar */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Gift className="h-8 w-8 text-orange-500" />
              <div>
                <h3 className="text-xl font-bold text-gray-800">Special Offers</h3>
                <p className="text-gray-600">Get exciting deals and cashback offers</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Badge className="bg-orange-500 text-white px-4 py-2">
                Flat ₹200 Off on ₹999+
              </Badge>
              <Badge className="bg-pink-500 text-white px-4 py-2">
                Extra 10% Cashback
              </Badge>
            </div>
          </div>
        </div>

        {/* Deal of the Day */}
        <DealSection deal={deals[0]} showTimer={true} />

        {/* Trending Products */}
        <DealSection deal={deals[1]} />
        
        {/* Featured Products */}
        <Card className="bg-white p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {featuredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
                onWishlist={onWishlist}
              />
            ))}
          </div>
        </Card>

        {/* Reseller section */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Become a Meesho Reseller</h2>
            <p className="text-lg mb-6 opacity-90">
              Start your own business with zero investment. Sell products to your network and earn profits.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-80">Investment Required</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10M+</div>
                <div className="text-sm opacity-80">Active Resellers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">₹50,000+</div>
                <div className="text-sm opacity-80">Monthly Earnings</div>
              </div>
            </div>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-full"
            >
              Start Reselling Now
            </Button>
          </div>
        </Card>

        {/* App download section */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Download the Meesho App</h2>
              <p className="text-lg opacity-90">
                Shop on the go with exclusive app-only deals and faster checkout
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-left">
                    <div className="text-xs">GET IT ON</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </div>
              </Button>
              <Button 
                className="bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;