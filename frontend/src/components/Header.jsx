import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Heart, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const Header = ({ cartItems = [], onSearch, onAuthClick, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center py-2 text-sm">
        <span className="font-medium">🎉 Become a Reseller and Start Earning Today! No Investment Required</span>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button 
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg px-3 py-2 font-bold text-xl">
                M
              </div>
              <span className="text-2xl font-bold text-gray-800">meesho</span>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Try Saree, Kurti or Search by Product Code"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-pink-400 focus:ring-0"
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600 text-white rounded-md px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Mobile search */}
            <button className="md:hidden">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Download app */}
            <div className="hidden lg:block">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Download App
              </Button>
            </div>

            {/* Become supplier */}
            <div className="hidden lg:block">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-pink-600 font-medium"
              >
                Become a Supplier
              </Button>
            </div>

            {/* Notifications */}
            <button className="hidden md:block relative">
              <Bell className="h-5 w-5 text-gray-600" />
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                3
              </Badge>
            </button>

            {/* Wishlist */}
            <button className="hidden md:block relative">
              <Heart className="h-5 w-5 text-gray-600" />
            </button>

            {/* Cart */}
            <button className="relative">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
                  {cartItems.length}
                </Badge>
              )}
            </button>

            {/* Profile */}
            <Button 
              variant="ghost" 
              className="flex items-center space-x-2 text-gray-700 hover:text-pink-600"
              onClick={onAuthClick}
            >
              <User className="h-5 w-5" />
              <span className="hidden md:block">
                {user ? user.name.split(' ')[0] : 'Profile'}
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Try Saree, Kurti or Search by Product Code"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-lg"
              />
              <Button 
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 hover:bg-pink-600"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            <Button variant="ghost" className="w-full justify-start">Download App</Button>
            <Button variant="ghost" className="w-full justify-start">Become a Supplier</Button>
            <Button variant="ghost" className="w-full justify-start">Notifications</Button>
            <Button variant="ghost" className="w-full justify-start">Wishlist</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;