import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { Filter, X } from 'lucide-react';
import axios from '../utils/axios';

const ProductListPage = () => {
  const { sectionSlug, categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    brands: [],
    sizes: [],
    colors: [],
    price: null,
    discount: null
  });

  // Available filters
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [0, 10000]
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/products');
        if (response.data.success) {
          const allProducts = response.data.products;
          
          // Filter products based on URL parameters
          const filteredProducts = allProducts.filter(
            (product) =>
              product.category === sectionSlug &&
              product.productType === categorySlug
          );
          
          setProducts(filteredProducts);
          extractAvailableFilters(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sectionSlug, categorySlug]);

  const extractAvailableFilters = (products) => {
    const brands = [...new Set(products.map(p => p.brand))];
    const sizes = [...new Set(products.flatMap(p => 
      p.sizes?.map(size => size.size) || []
    ))];
    const colors = [...new Set(products.map(p => p.color))];
    const prices = products.map(p => p.price);
    const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 10000;

    setAvailableFilters({
      brands: brands.map(brand => ({ 
        label: brand, 
        value: brand,
        count: products.filter(p => p.brand === brand).length 
      })),
      sizes: sizes.map(size => ({ 
        label: size, 
        value: size,
        count: products.filter(p => p.sizes?.some(s => s.size === size && s.inStock)).length 
      })),
      colors: colors.map(color => ({ 
        label: color, 
        value: color,
        count: products.filter(p => p.color === color).length 
      })),
      priceRange: [minPrice, maxPrice]
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'price' || filterType === 'discount') {
        if (filterType === 'price') {
          return { ...prev, price: JSON.stringify(prev.price) === JSON.stringify(value) ? null : value };
        }
        return { ...prev, [filterType]: prev[filterType] === value ? null : value };
      }
      
      const currentArray = prev[filterType] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [filterType]: newArray };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      brands: [],
      sizes: [],
      colors: [],
      price: null,
      discount: null
    });
  };

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      if (filters.sizes.length > 0) {
        const hasSelectedSize = product.sizes?.some(size => 
          filters.sizes.includes(size.size) && size.inStock
        );
        if (!hasSelectedSize) return false;
      }

      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
        return false;
      }

      if (filters.price) {
        const [minPrice, maxPrice] = filters.price;
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }
      }

      if (filters.discount && product.discount < filters.discount) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return sorted.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredProducts, sortBy]);

  // Generate SEO details
  const generateSEODetails = () => {
    const brandName = "StyleCart";
    
    if (loading) {
      return {
        title: `Loading ${categorySlug || 'Products'} | ${brandName}`,
        description: `Loading ${categorySlug ? categorySlug.replace(/-/g, ' ') : 'products'} collection. Browse our latest fashion and style products.`,
        keywords: `${categorySlug}, products, loading, ${brandName}`
      };
    }

    const categoryName = categorySlug ? categorySlug.replace(/-/g, ' ') : 'Products';
    const sectionName = sectionSlug ? sectionSlug.replace(/-/g, ' ') : '';
    const productCount = sortedProducts.length;
    
    const filterDescriptions = [];
    if (filters.brands.length > 0) filterDescriptions.push(`${filters.brands.length} brand${filters.brands.length > 1 ? 's' : ''}`);
    if (filters.colors.length > 0) filterDescriptions.push(`${filters.colors.length} color${filters.colors.length > 1 ? 's' : ''}`);
    if (filters.price) filterDescriptions.push('price range');
    
    const filterText = filterDescriptions.length > 0 
      ? ` filtered by ${filterDescriptions.join(', ')}` 
      : '';

    return {
      title: `${categoryName} ${sectionName ? `- ${sectionName}` : ''} | ${productCount} Products | ${brandName}`,
      description: `Browse ${productCount} ${categoryName.toLowerCase()} products${sectionName ? ` in ${sectionName}` : ''}${filterText}. Shop the latest collection with various sizes, colors, and brands. Free shipping available.`,
      keywords: `${categoryName}, ${sectionName}, fashion, clothing, ${filters.brands.join(', ')}, ${filters.colors.join(', ')}, buy online, ${brandName}`
    };
  };

  // Generate structured data
  const generateStructuredData = () => {
    const brandName = "StyleCart";
    const categoryName = categorySlug ? categorySlug.replace(/-/g, ' ') : 'Products';
    const sectionName = sectionSlug ? sectionSlug.replace(/-/g, ' ') : '';
    const canonicalUrl = `${window.location.origin}${sectionSlug ? `/${sectionSlug}` : ''}${categorySlug ? `/${categorySlug}` : ''}`;

    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${categoryName} ${sectionName ? `- ${sectionName}` : ''}`,
      "description": `Collection of ${categoryName.toLowerCase()} products${sectionName ? ` in ${sectionName}` : ''}`,
      "url": canonicalUrl,
      "mainEntity": {
        "@type": "ItemList",
        "numberOfItems": sortedProducts.length,
        "itemListElement": sortedProducts.slice(0, 10).map((product, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "name": product.productName,
            "description": product.productDescription,
            "image": product.images?.[0]?.url,
            "sku": product._id,
            "brand": {
              "@type": "Brand",
              "name": product.brand || brandName
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": product.price,
              "availability": product.sizes?.some(s => s.inStock) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": brandName
              }
            }
          }
        }))
      }
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        ...(sectionSlug ? [{
          "@type": "ListItem",
          "position": 2,
          "name": sectionName,
          "item": `${window.location.origin}/${sectionSlug}`
        }] : []),
        {
          "@type": "ListItem",
          "position": sectionSlug ? 3 : 2,
          "name": categoryName,
          "item": canonicalUrl
        }
      ]
    };

    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": brandName,
      "url": window.location.origin,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${window.location.origin}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    return [baseSchema, breadcrumbSchema, websiteSchema];
  };

  const seoDetails = generateSEODetails();
  const structuredData = generateStructuredData();
  const brandName = "StyleCart";
  const canonicalUrl = `${window.location.origin}${sectionSlug ? `/${sectionSlug}` : ''}${categorySlug ? `/${categorySlug}` : ''}`;

  // Force update document title
  useEffect(() => {
    if (!loading) {
      document.title = seoDetails.title;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoDetails.description);
      }
      
      console.log('🔄 Product List SEO title updated to:', seoDetails.title);
    }
  }, [loading, seoDetails.title, seoDetails.description]);

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      if (filter !== null && filter !== '') return count + 1;
      return count;
    }, 0);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>{seoDetails.title}</title>
          <meta name="description" content={seoDetails.description} />
        </Helmet>
        <div className="min-h-screen bg-cream-white font-serif flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
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
        <meta property="og:image" content={`${window.location.origin}/category-og-image.jpg`} />
        <meta property="og:site_name" content={brandName} />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoDetails.title} />
        <meta name="twitter:description" content={seoDetails.description} />
        <meta name="twitter:image" content={`${window.location.origin}/category-twitter-image.jpg`} />

        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={brandName} />
        <meta name="publisher" content={brandName} />

        {/* Structured Data */}
        {structuredData.map((data, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(data)}
          </script>
        ))}
      </Helmet>

      <div className="min-h-screen bg-cream-white font-serif">
        {/* Hidden SEO Heading */}
        <h1 className="sr-only">
          {categorySlug ? categorySlug.replace(/-/g, ' ') : 'Products'} 
          {sectionSlug ? ` - ${sectionSlug.replace(/-/g, ' ')}` : ''} 
          Collection
        </h1>
        
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-20 py-8">
          <div className="flex gap-12">
            {/* Desktop Filters - Clean Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                availableFilters={availableFilters}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Mobile Filters Overlay */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="fixed inset-0 bg-black/40 bg-opacity-50" onClick={() => setShowFilters(false)} />
                <div className="fixed top-0 left-0 h-full w-80 bg-cream-white overflow-y-auto p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    availableFilters={availableFilters}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </div>
            )}

            {/* Products Section */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
                <div>
                  <h2 className="text-lg font-normal text-gray-900 mb-2 capitalize">
                    {categorySlug ? categorySlug.replace(/-/g, ' ') : 'All Products'}
                    {sectionSlug && (
                      <span className="text-gray-600 ml-2">- {sectionSlug.replace(/-/g, ' ')}</span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Showing {sortedProducts.length} products
                    {getActiveFiltersCount() > 0 && ` • ${getActiveFiltersCount()} filter${getActiveFiltersCount() === 1 ? '' : 's'} applied`}
                  </p>
                </div>

                <div className="flex items-center gap-6 mt-4 lg:mt-0">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                    {getActiveFiltersCount() > 0 && (
                      <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getActiveFiltersCount()}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">Sort by</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border-0 bg-transparent text-sm font-normal text-gray-900 focus:outline-none focus:ring-0 py-1"
                    >
                      <option value="featured">Relevance</option>
                      <option value="newest">New In</option>
                      <option value="price-low-high">Price: Low to High</option>
                      <option value="price-high-low">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Filters Bar */}
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filters.brands?.map(brand => (
                    <span
                      key={brand}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs capitalize"
                    >
                      {brand.toLowerCase()}
                      <button
                        onClick={() => handleFilterChange('brands', brand)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.colors?.map(color => (
                    <span
                      key={color}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs capitalize"
                    >
                      {color.toLowerCase()}
                      <button
                        onClick={() => handleFilterChange('colors', color)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.sizes?.map(size => (
                    <span
                      key={size}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {size}
                      <button
                        onClick={() => handleFilterChange('sizes', size)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.price && (
                    <span
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      Price: ₹{filters.price[0]} - ₹{filters.price[1]}
                      <button
                        onClick={() => handleFilterChange('price', filters.price)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.discount && (
                    <span
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      Discount: {filters.discount}%+
                      <button
                        onClick={() => handleFilterChange('discount', filters.discount)}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* No Results */}
              {sortedProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-sm mb-2">No products found</div>
                  <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or browse other categories</p>
                  <button
                    onClick={handleClearFilters}
                    className="px-4 py-2 bg-black text-white text-sm rounded-sm hover:bg-gray-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListPage;