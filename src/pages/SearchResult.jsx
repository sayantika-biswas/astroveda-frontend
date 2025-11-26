import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, X, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import axios from '../utils/axios';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    colors: [], 
    sizes: [],
    brands: [],
    price: null,
    discount: null
  });

  const [availableFilters, setAvailableFilters] = useState({
    colors: [],
    sizes: [],
    brands: [],
    priceRange: [0, 10000]
  });

  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse search query from URL
  const searchQuery = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('q') || '';
  }, [location.search]);

  // Parse URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {
      colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      price: searchParams.get('price') ? searchParams.get('price').split('-').map(Number) : null,
      discount: searchParams.get('discount') ? parseInt(searchParams.get('discount')) : null
    };
    
    setFilters(urlFilters);
  }, [location.search]);

  // Update URL with filters
  const updateURL = useCallback((newFilters) => {
    const searchParams = new URLSearchParams();
    
    // Preserve search query
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    }
    
    // Add filters to URL parameters
    if (newFilters.colors.length > 0) {
      searchParams.set('colors', newFilters.colors.join(','));
    }
    if (newFilters.sizes.length > 0) {
      searchParams.set('sizes', newFilters.sizes.join(','));
    }
    if (newFilters.brands.length > 0) {
      searchParams.set('brands', newFilters.brands.join(','));
    }
    if (newFilters.price) {
      searchParams.set('price', newFilters.price.join('-'));
    }
    if (newFilters.discount) {
      searchParams.set('discount', newFilters.discount.toString());
    }
    
    const newUrl = `/search?${searchParams.toString()}`;
    navigate(newUrl, { replace: true });
  }, [searchQuery, navigate]);

  // Fetch search results
  const fetchSearchResults = useCallback(async () => {
    if (!searchQuery) {
      setProducts([]);
      setTotalResults(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Build API parameters from current filters
      const params = {
        q: searchQuery,
        ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
        ...(filters.sizes.length > 0 && { sizes: filters.sizes.join(',') }),
        ...(filters.brands.length > 0 && { brands: filters.brands.join(',') }),
        ...(filters.price && { minPrice: filters.price[0], maxPrice: filters.price[1] }),
        ...(filters.discount && { discount: filters.discount })
      };

      const response = await axios.get('/search', { params });
      
      if (response.data.success) {
        const productsData = response.data.data?.products || [];
        setProducts(productsData);
        setTotalResults(productsData.length);
        
        if (response.data.data?.availableFilters) {
          setAvailableFilters(response.data.data.availableFilters);
        } else {
          extractAvailableFilters(productsData);
        }
      } else {
        setProducts([]);
        setTotalResults(0);
        resetAvailableFilters();
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to load search results. Please try again.');
      setProducts([]);
      setTotalResults(0);
      resetAvailableFilters();
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Fetch results when search query or filters change
  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  const resetAvailableFilters = () => {
    setAvailableFilters({
      colors: [],
      sizes: [],
      brands: [],
      priceRange: [0, 10000]
    });
  };

  const extractAvailableFilters = (products) => {
    const colors = new Map();
    const sizes = new Map();
    const brands = new Map();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach(product => {
      // Colors
      if (product.color) {
        colors.set(product.color, (colors.get(product.color) || 0) + 1);
      }
      
      // Sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(sizeObj => {
          if (sizeObj.inStock && sizeObj.count > 0 && sizeObj.size) {
            sizes.set(sizeObj.size, (sizes.get(sizeObj.size) || 0) + 1);
          }
        });
      }
      
      // Brands
      if (product.brand) {
        brands.set(product.brand, (brands.get(product.brand) || 0) + 1);
      }
      
      // Price range
      if (product.price < minPrice) minPrice = product.price;
      if (product.price > maxPrice) maxPrice = product.price;
    });

    setAvailableFilters({
      colors: Array.from(colors.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      sizes: Array.from(sizes.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      brands: Array.from(brands.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      priceRange: [minPrice === Infinity ? 0 : minPrice, maxPrice === 0 ? 10000 : maxPrice]
    });
  };

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => {
      let newFilters;
      
      if (filterType === 'price' || filterType === 'discount') {
        newFilters = {
          ...prev,
          [filterType]: prev[filterType] === value ? null : value
        };
      } else {
        const currentArray = prev[filterType] || [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        newFilters = {
          ...prev,
          [filterType]: newArray
        };
      }
      
      updateURL(newFilters);
      return newFilters;
    });
  }, [updateURL]);

  const clearAllFilters = useCallback(() => {
    const newFilters = {
      colors: [],
      sizes: [],
      brands: [],
      price: null,
      discount: null
    };
    
    setFilters(newFilters);
    updateURL(newFilters);
  }, [updateURL]);

  // Memoized computed values
  const hasActiveFilters = useMemo(() => {
    return filters.colors.length > 0 || 
           filters.sizes.length > 0 || 
           filters.brands.length > 0 || 
           filters.price !== null || 
           filters.discount !== null;
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.price !== null) count += 1;
    if (filters.discount !== null) count += 1;
    return count;
  }, [filters]);

  // Generate SEO details - EXACTLY LIKE CART PAGE
  const generateSEODetails = () => {
    if (!searchQuery) {
      return {
        title: "Search Products | Our Store",
        description: "Search for products in our store. Find the latest fashion, electronics, and more with advanced filters and search options.",
        keywords: "search, products, find, browse, online store"
      };
    }

    if (loading) {
      return {
        title: "Searching... | Our Store",
        description: "Searching for products in our store...",
        keywords: "searching, products, find, browse"
      };
    }

    const filterDescriptions = [];
    if (filters.colors.length > 0) filterDescriptions.push(`${filters.colors.length} color${filters.colors.length > 1 ? 's' : ''}`);
    if (filters.brands.length > 0) filterDescriptions.push(`${filters.brands.length} brand${filters.brands.length > 1 ? 's' : ''}`);
    if (filters.price) filterDescriptions.push('price range');
    
    const filterText = filterDescriptions.length > 0 
      ? ` filtered by ${filterDescriptions.join(', ')}` 
      : '';

    return {
      title: `"${searchQuery}" - ${totalResults} Products Found | Our Store`,
      description: `Find ${totalResults} products for "${searchQuery}"${filterText}. Browse our collection with various filters and find your perfect match.`,
      keywords: `${searchQuery}, products, search, buy online, fashion, ${filterDescriptions.join(', ')}`
    };
  };

  const seoDetails = generateSEODetails();
  const brandName = "StyleCart";
  const canonicalUrl = `${window.location.origin}/search?q=${encodeURIComponent(searchQuery)}`;

  // Force update document title - LIKE CART PAGE
  useEffect(() => {
    if (!loading) {
      document.title = seoDetails.title;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoDetails.description);
      }
      
      console.log('🔄 Search Results SEO title updated to:', seoDetails.title);
    }
  }, [loading, seoDetails.title, seoDetails.description]);

  // Loading state - EXACTLY LIKE CART PAGE
  if (loading) {
    return ( 
      <>
        <Helmet>
          <title>Searching... | StyleCart</title>
          <meta name="description" content="Searching for products..." />
        </Helmet>
        <div className="min-h-screen bg-cream-white pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{seoDetails.title}</title>
        <meta name="description" content={seoDetails.description} />
        <meta name="keywords" content={seoDetails.keywords} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={seoDetails.title} />
        <meta property="og:description" content={seoDetails.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${window.location.origin}/search-results-og.jpg`} />
        <meta property="og:site_name" content={brandName} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={seoDetails.title} />
        <meta name="twitter:description" content={seoDetails.description} />
        <meta name="twitter:image" content={`${window.location.origin}/search-results-twitter.jpg`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            "name": `Search Results for "${searchQuery}"`,
            "description": seoDetails.description,
            "url": canonicalUrl,
            "numberOfItems": totalResults
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-cream-white font-serif pt-20">
        {/* Hidden SEO Heading */}
        <h1 className="sr-only">{seoDetails.title}</h1>
        
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-light text-gray-900 mb-2">
                  Search Results {searchQuery && `for "${searchQuery}"`}
                </h2>
                <p className="text-gray-600">
                  {totalResults} {totalResults === 1 ? 'product' : 'products'} found
                  {hasActiveFilters && ` • ${activeFiltersCount} filter${activeFiltersCount === 1 ? '' : 's'} applied`}
                </p>
              </div>
              
              {/* View Controls */}
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                  aria-label="Open filters"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-gray-100 text-gray-700' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4" role="region" aria-label="Active filters">
                {filters.colors.map(color => (
                  <span key={color} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Color: {color}</span>
                    <button
                      onClick={() => handleFilterChange('colors', color)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`Remove color filter ${color}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {filters.sizes.map(size => (
                  <span key={size} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Size: {size}</span>
                    <button
                      onClick={() => handleFilterChange('sizes', size)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`Remove size filter ${size}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {filters.brands.map(brand => (
                  <span key={brand} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Brand: {brand}</span>
                    <button
                      onClick={() => handleFilterChange('brands', brand)}
                      className="hover:text-red-500 transition-colors"
                      aria-label={`Remove brand filter ${brand}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {filters.price && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Price: ₹{filters.price[0]} - ₹{filters.price[1]}</span>
                    <button
                      onClick={() => handleFilterChange('price', filters.price)}
                      className="hover:text-red-500 transition-colors"
                      aria-label="Remove price filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {filters.discount && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                    <span>Discount: {filters.discount}%+</span>
                    <button
                      onClick={() => handleFilterChange('discount', filters.discount)}
                      className="hover:text-red-500 transition-colors"
                      aria-label="Remove discount filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                <button
                  onClick={clearAllFilters}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium transition-colors"
                  aria-label="Clear all filters"
                >
                  Clear All
                </button>
              </div>
            )}
          </header>

          {/* Results Section */}
          <main>
            {error ? (
              <section className="text-center py-12" role="alert">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                  onClick={fetchSearchResults}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Try Again
                </button>
              </section>
            ) : products.length === 0 ? (
              <section className="text-center py-12">
                <h3 className="text-xl font-light text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery 
                    ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.`
                    : 'Please enter a search term.'
                  }
                </p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Browse All Products
                </button>
              </section>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Desktop Filters */}
                <aside className="hidden lg:block lg:col-span-1" aria-label="Product filters">
                  <ProductFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    availableFilters={availableFilters}
                    onClearFilters={clearAllFilters}
                  />
                </aside>

                {/* Products Grid */}
                <section className="lg:col-span-3" aria-label="Search results">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
                          <ProductCard product={product} view="list" />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </main>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-normal">FILTERS</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <ProductFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    availableFilters={availableFilters}
                    onClearFilters={clearAllFilters}
                  />
                  <div className="mt-6 p-4 border-t">
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;