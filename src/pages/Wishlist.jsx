import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';
import WishlistCard from '../components/WishlistCard';
import axios from '../utils/axios';
import { useApp } from '../context/AppContext';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { refreshWishlistCount, decrementWishlistCount, incrementCartCount } = useApp();

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/wishlist');
            console.log('Wishlist API Response:', response.data);
            if (response.data.success) {
                setWishlistItems(response.data.wishlist?.products || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    // Define removeFromWishlist function
    const removeFromWishlist = async (productId) => {
        try {
            const response = await axios.post('/wishlist/remove', { productId });
            if (response.data.success) {
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
                decrementWishlistCount(); // Update global wishlist count
                toast.success('Removed from wishlist');
            } else {
                toast.error('Failed to remove from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove from wishlist');
            refreshWishlistCount();
        }
    };

    // Define addToBag function
    const addToBag = async (productId, selectedSizeObj) => {
        try {
            console.log(`Product ${productId} with size ${selectedSizeObj.size} added to bag`);
            
            const response = await axios.post('/cart/add', {
                productId: productId,
                size: selectedSizeObj.size,
                sizeLabel: selectedSizeObj.sizeLabel,
                quantity: 1
            });

            if (response.data.success) {
                incrementCartCount();
                await removeFromWishlist(productId);
                
                const sizeDisplay = selectedSizeObj.sizeLabel || selectedSizeObj.size;
                toast.success(
                    <div>
                        <div className="font-semibold">Added to Bag!</div>
                        <div className="text-sm">Size: {sizeDisplay}</div>
                    </div>,
                    {
                        autoClose: 3000,
                        closeButton: true,
                    }
                );
            } else {
                toast.error('Failed to add product to bag');
            }
        } catch (error) {
            console.error('Error adding to bag:', error);
            
            if (error.response) {
                const message = error.response.data?.message || 'Failed to add product to bag';
                toast.error(message);
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error('Failed to add product to bag');
            }
        }
    };

    // Generate SEO details function
    const generateSEODetails = (items = []) => {
        const itemCount = items?.length || 0;
        const brandName = "StyleCart";
        
        if (itemCount === 0) {
            return {
                title: `My Wishlist | ${brandName}`,
                description: `Manage your wishlist and save your favorite products for later. Create your personalized collection at ${brandName}.`,
            };
        }

        const productNames = items.map(item => item.name).slice(0, 3);
        
        return {
            title: `My Wishlist (${itemCount} items) | ${brandName}`,
            description: `My wishlist with ${itemCount} saved products including ${productNames.join(', ')}. Save, manage and shop your favorite products.`,
        };
    };

    const brandName = "StyleCart";
    const canonicalUrl = `${window.location.origin}/wishlist`;
    const seoDetails = generateSEODetails(wishlistItems);
    // Add this useEffect after your SEO details generation
useEffect(() => {
  if (!loading && wishlistItems) {
    // Force update the document title immediately
    document.title = seoDetails.title;
    
    // Also update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription)  // Generate SEO details AFTER loading check with actual data
    {
      metaDescription.setAttribute('content', seoDetails.description);
    }
    
    console.log('🔄 SEO title updated to:', seoDetails.title);
  }
}, [loading, wishlistItems, seoDetails.title, seoDetails.description]);


    // Refresh global wishlist count when component mounts
    useEffect(() => {
        refreshWishlistCount();
    }, []);

    if (loading) {
        return (
            <>
                <Helmet>
                    <title>My Wishlist | {brandName}</title>
                    <meta name="description" content="Loading your saved items and wishlist..." />
                </Helmet>
                <div className="min-h-screen flex items-center justify-center bg-cream-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your wishlist...</p>
                    </div>
                </div>
                <ToastContainer />
            </>
        );
    }

   
    return (
        <>
            <Helmet>
                <title>{seoDetails.title}</title>
                <meta name="description" content={seoDetails.description} />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content={seoDetails.title} />
                <meta property="og:description" content={seoDetails.description} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:image" content={`${window.location.origin}/wishlist-og-image.jpg`} />
                <meta property="og:site_name" content={brandName} />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={seoDetails.title} />
                <meta name="twitter:description" content={seoDetails.description} />
                <meta name="twitter:image" content={`${window.location.origin}/wishlist-twitter-image.jpg`} />

                {/* Additional SEO Meta Tags */}
                <meta name="robots" content="index, follow" />
                <meta name="author" content={brandName} />
            </Helmet>

            <div className="min-h-screen font-serif bg-cream-white py-6">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    style={{
                        fontSize: '14px',
                    }}
                />
                
                <div className="max-w-7xl mx-auto px-6 py-4">
                    {/* Breadcrumb for better SEO and UX */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
                        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Wishlist</span>
                    </nav>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center space-x-3">
                            <Heart className="w-6 h-6 text-red-500 fill-current" />
                            <h1 className="text-xl md:text-2xl font-bold">My Wishlist</h1>
                        </div>
                        <span className="text-gray-600">{wishlistItems?.length || 0} items</span>
                    </div>

                    {wishlistItems && wishlistItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your wishlist is empty</h2>
                                <p className="text-gray-600 mb-6">
                                    Save items you love to your wishlist. Review them anytime and easily move them to your bag.
                                </p>
                                <Link 
                                    to="/" 
                                    className="inline-block bg-orange-500 text-white px-8 py-3 rounded-md font-medium hover:bg-orange-600 transition-colors duration-200"
                                    aria-label="Start shopping to add items to your wishlist"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Hidden heading for SEO hierarchy */}
                            <h2 className="sr-only">Wishlist Items</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                                {wishlistItems.map((product) => (
                                    <WishlistCard 
                                        key={product._id} 
                                        product={product} 
                                        onRemoveFromWishlist={removeFromWishlist} 
                                        onAddToBag={addToBag} 
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default WishlistPage;