import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import axios from '../utils/axios';

const Home = () => {
  const [categorySections, setCategorySections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorySections = async () => {
      try {
        const response = await axios.get('/category-sections');
        
        if (response.data.success) {
          setCategorySections(response.data.categorySections);
        } else {
          throw new Error('Failed to fetch category sections');
        }
      } catch (err) {
        console.error('Error fetching category sections:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySections();
  }, []);

  // Generate dynamic meta description based on categories
  const generateMetaDescription = () => {
    if (categorySections.length === 0) {
      return "Discover amazing products across various categories. Shop the best deals and find what you need.";
    }
    
    const categoryNames = categorySections.flatMap(section => 
      section.categories.map(cat => cat.name)
    );
    
    const uniqueCategories = [...new Set(categoryNames)].slice(0, 5);
    return `Explore our extensive collection of products including ${uniqueCategories.join(', ')} and more. Shop now for the best prices and quality products.`;
  };

  const metaDescription = generateMetaDescription();
  const pageTitle = " StyleCart| Top Products in Various Categories";
  const canonicalUrl = window.location.origin;

    // Add this useEffect after your SEO details generation
useEffect(() => {
  if (!loading ) {
    // Force update the document title immediately
    document.title = pageTitle;
    
    // Also update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription)  // Generate SEO details AFTER loading check with actual data
    {
      metaDescription.setAttribute('content', metaDescription);
    }
    
    console.log('🔄 SEO title updated to:', pageTitle);
  }
}, [loading,  pageTitle , metaDescription]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>StyleCart</title>
          <meta name="description" content="Loading our amazing product collection..." />
        </Helmet>
        <div className="m-0 bg-cream-white min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | StyleCart</title>
          <meta name="description" content="Sorry, we encountered an error loading our products." />
        </Helmet>
        <div className="m-0 bg-cream-white min-h-screen flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Error loading categories: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        {/* Add your actual image URL here */}
        <meta property="og:image" content={`${canonicalUrl}/og-image.jpg`} />
        <meta property="og:site_name" content="Your Store Name" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={`${canonicalUrl}/twitter-image.jpg`} />

        {/* Additional SEO Meta Tags */}
        <meta name="keywords" content={categorySections.flatMap(section => 
          section.categories.map(cat => cat.name)
        ).join(', ')} />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Your Store Name" />
        
        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Your Store Name",
            "url": canonicalUrl,
            "description": metaDescription,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${canonicalUrl}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>

        {/* Product Collection Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Product Categories",
            "description": metaDescription,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": categorySections.reduce((total, section) => total + section.categories.length, 0),
              "itemListElement": categorySections.flatMap((section, sectionIndex) => 
                section.categories.map((category, categoryIndex) => ({
                  "@type": "ListItem",
                  "position": sectionIndex * section.categories.length + categoryIndex + 1,
                  "item": {
                    "@type": "Product",
                    "name": category.name,
                    "description": `Shop ${category.name} products`,
                    "url": `${canonicalUrl}/products/${section.slug}/${category.slug}`,
                    "image": category.image
                  }
                }))
              )
            }
          })}
        </script>
      </Helmet>

      <div className="m-0 bg-cream-white">
        {/* Carousel Section */}
        <Carousel />
        
        {/* Category Sections */}
        <section className="font-serif bg-cream-white">
          <div className="container mx-auto px-4">
            
            {/* Main Shop By Category Heading */}
            <div className="text-center mb-5">
              <h1 className="md:text-3xl font-bold text-gray-800 pt-4 pb-2 sm:text-sm">
                SHOP BY CATEGORY
              </h1>
              <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
            </div>
            
            {/* Render each category section */}
            {categorySections.map((section) => (
              <div key={section._id}>
                {/* Section Sub-heading */}
                <div className="text-center mb-8">
                  <h2 className="md:text-2xl font-semibold text-gray-700 mb-1 sm:text-sm">
                    {section.name.toUpperCase()}
                  </h2>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {section.categories.map((category) => (
                    <Link
                      key={category._id}
                      to={`/products/${section.slug}/${category.slug}`}
                      className="block overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      aria-label={`Browse ${category.name} products`}
                    >
                      <img
                        src={category.image}
                        alt={`${category.name} products - Shop now`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/fallback-image.jpg';
                        }}
                        loading="lazy"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </section>
      </div>
    </>
  );
};

export default Home;