import React, { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';

const ProductDetailPage = ({ product, onAddToCart, onBuyNow, onGoBack }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Blue');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Product not found</h2>
          <Button onClick={onGoBack}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Blue', 'Black', 'White', 'Red', 'Green'];

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const reviews = [
    {
      id: 1,
      user: 'Priya S.',
      rating: 5,
      comment: 'Amazing quality! Love the fabric and fit. Highly recommended.',
      date: '2 days ago',
      verified: true
    },
    {
      id: 2,
      user: 'Rahul M.',
      rating: 4,
      comment: 'Good product but delivery was a bit delayed. Overall satisfied.',
      date: '1 week ago',
      verified: true
    },
    {
      id: 3,
      user: 'Anjali K.',
      rating: 5,
      comment: 'Perfect size and color as shown in the image. Great value for money!',
      date: '2 weeks ago',
      verified: true
    }
  ];

  const handleAddToCart = () => {
    const productWithSelections = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    onAddToCart && onAddToCart(productWithSelections);
  };

  const handleBuyNow = () => {
    const productWithSelections = {
      ...product,
      selectedSize,
      selectedColor,
      quantity
    };
    onBuyNow && onBuyNow(productWithSelections);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="mb-4 flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="p-4">
              <div className="aspect-square overflow-hidden rounded-lg mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600">By {product.seller}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-800">{product.rating}</span>
                </div>
                <span className="text-gray-600">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
                <Badge className="bg-green-500 text-white font-semibold">
                  {discountPercent}% OFF
                </Badge>
              </div>

              {/* Size selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={selectedSize === size ? 'bg-pink-500 hover:bg-pink-600' : ''}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color selection */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Select Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedColor(color)}
                      className={selectedColor === color ? 'bg-pink-500 hover:bg-pink-600' : ''}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="font-semibold text-lg px-4">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-4 mb-6">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                >
                  Buy Now
                </Button>
              </div>

              {/* Delivery info */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-800">Free Delivery</p>
                    <p className="text-sm text-gray-600">Delivery in {product.deliveryTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">7 Days Return</p>
                    <p className="text-sm text-gray-600">Easy return & exchange</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-800">Quality Assured</p>
                    <p className="text-sm text-gray-600">100% authentic products</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Card className="mt-8 p-6">
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-600 mb-4">
                  This beautiful {product.name.toLowerCase()} is perfect for any occasion. 
                  Made from high-quality materials with attention to detail, it offers both 
                  comfort and style. The design is contemporary yet timeless, making it a 
                  versatile addition to your wardrobe.
                </p>
                
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                  <li>Premium quality fabric</li>
                  <li>Comfortable fit</li>
                  <li>Easy to care for</li>
                  <li>Available in multiple sizes and colors</li>
                  <li>Perfect for daily wear</li>
                </ul>

                <h4 className="font-semibold mb-2">Care Instructions:</h4>
                <p className="text-gray-600">
                  Machine wash cold with like colors. Do not bleach. Tumble dry low. 
                  Iron on low heat if needed.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>

                <div className="space-y-4">
                  {reviews.map(review => (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{review.user}</span>
                            {review.verified && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Verified Purchase
                              </Badge>
                            )}
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Standard Delivery</span>
                      <span className="font-medium">Free (7-10 days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Express Delivery</span>
                      <span className="font-medium">₹99 (3-5 days)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Same Day Delivery</span>
                      <span className="font-medium">₹199 (Selected cities only)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 7-day return window from delivery date</li>
                    <li>• Items must be unused and in original packaging</li>
                    <li>• Free return pickup available</li>
                    <li>• Refund processed within 5-7 business days</li>
                    <li>• Exchange available for size/color issues</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;