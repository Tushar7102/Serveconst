import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

// Components
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AuthModal from "./components/AuthModal";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";

// Data
import { mockUser, mockCart } from "./data/mockData";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AppContent() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const helloWorldApi = async () => {
    try {
      const response = await axios.get(`${API}/`);
      console.log(response.data.message);
    } catch (e) {
      console.error(e, `errored out requesting / api`);
    }
  };

  useEffect(() => {
    helloWorldApi();
    // Load mock data
    setCartItems(mockCart);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    toast({
      title: "Welcome to Meesho!",
      description: `Hi ${userData.name}, you're successfully logged in.`
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  const handleAuthClick = () => {
    if (user) {
      // Show user menu or profile
      handleLogout();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentCategory(null);
    navigate('/products');
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    setSearchQuery('');
    navigate('/products');
  };

  const handleProductClick = (product) => {
    setCurrentProduct(product);
    navigate('/product');
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => 
      item.id === product.id && 
      item.selectedSize === product.selectedSize && 
      item.selectedColor === product.selectedColor
    );

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: product.quantity || 1 }]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  const handleWishlist = (product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`
    });
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    toast({
      title: "Redirecting to Checkout",
      description: "Taking you to the checkout page..."
    });
    // Navigate to checkout page (would be implemented)
  };

  const handleGoBack = () => {
    if (location.pathname === '/product') {
      navigate('/products');
    } else {
      navigate('/');
    }
  };

  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/products':
        return currentCategory ? currentCategory.name : searchQuery ? `Search: ${searchQuery}` : 'Products';
      case '/product':
        return currentProduct ? currentProduct.name : 'Product';
      default:
        return 'Meesho';
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      <Header
        cartItems={cartItems}
        onSearch={handleSearch}
        onAuthClick={handleAuthClick}
        user={user}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onProductClick={handleProductClick}
                onCategoryClick={handleCategoryClick}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductListingPage
                category={currentCategory}
                searchQuery={searchQuery}
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart}
                onWishlist={handleWishlist}
              />
            }
          />
          <Route
            path="/product"
            element={
              <ProductDetailPage
                product={currentProduct}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                onGoBack={handleGoBack}
              />
            }
          />
        </Routes>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Toast notifications */}
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
