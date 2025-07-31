import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AuthModal from "./components/AuthModal";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";

// API Services
import { authAPI, productsAPI, cartAPI } from "./services/api";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AppContent() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Initialize app - check for stored user and load cart
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for stored auth
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
          await loadCart();
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const loadCart = async () => {
    try {
      const response = await cartAPI.getCart();
      if (response.success) {
        setCartItems(response.data.items || []);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const handleLogin = async (userData) => {
    try {
      let response;
      
      if (userData.isLogin) {
        // Login existing user
        response = await authAPI.login({
          email: userData.email,
          password: userData.password
        });
      } else {
        // Register new user
        response = await authAPI.register({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password
        });
      }

      if (response.success) {
        // Store auth data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setUser(response.user);
        await loadCart();
        
        toast({
          title: "Welcome to Meesho!",
          description: `Hi ${response.user.name}, you're successfully logged in.`
        });
      }
    } catch (error) {
      console.error('Login/Register error:', error);
      toast({
        title: "Authentication Error",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCartItems([]);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    }
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

  const handleAddToCart = async (product) => {
    try {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to add items to cart.",
          variant: "destructive"
        });
        setIsAuthModalOpen(true);
        return;
      }

      const cartItem = {
        productId: product.id || product._id,
        quantity: product.quantity || 1,
        selectedSize: product.selectedSize,
        selectedColor: product.selectedColor
      };

      const response = await cartAPI.addToCart(cartItem);
      
      if (response.success) {
        setCartItems(response.data.items || []);
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart.`
        });
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add item to cart.",
        variant: "destructive"
      });
    }
  };

  const handleWishlist = (product) => {
    toast({
      title: "Added to Wishlist",
      description: `${product.name} has been added to your wishlist.`
    });
  };

  const handleBuyNow = async (product) => {
    await handleAddToCart(product);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg px-6 py-3 font-bold text-2xl mb-4">
            M
          </div>
          <p className="text-gray-600">Loading Meesho...</p>
        </div>
      </div>
    );
  }

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
