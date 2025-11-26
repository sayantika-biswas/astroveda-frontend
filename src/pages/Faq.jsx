// pages/FAQPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, ThumbsUp, ThumbsDown, Phone, Mail, MessageCircle } from 'lucide-react';
import axios from '../utils/axios';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set());
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(new Set());

  // FAQ categories
  const categories = [
    { id: 'all', name: 'All Questions', count: 0 },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'delivery', name: 'Delivery', icon: '🚚' },
    { id: 'returns', name: 'Returns & Exchanges', icon: '🔄' },
    { id: 'payments', name: 'Payments', icon: '💳' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'products', name: 'Products', icon: '👕' },
    { id: 'general', name: 'General', icon: '❓' }
  ];

  // Fetch FAQs from API
  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/faqs');
      
      if (response.status === 200) {
        const activeFaqs = response.data.filter(faq => faq.isActive !== false);
        setFaqs(activeFaqs);
        setFilteredFaqs(activeFaqs);
        
        // Update category counts
        updateCategoryCounts(activeFaqs);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to load FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateCategoryCounts = (faqList) => {
    const updatedCategories = categories.map(cat => {
      if (cat.id === 'all') {
        return { ...cat, count: faqList.length };
      }
      const count = faqList.filter(faq => faq.category === cat.id).length;
      return { ...cat, count };
    });
    // Update the first category (all) with total count
    updatedCategories[0].count = faqList.length;
  };

  // Filter FAQs based on search and category
  useEffect(() => {
    let filtered = faqs;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(term) || 
        faq.answer.toLowerCase().includes(term)
      );
    }

    setFilteredFaqs(filtered);
  }, [searchTerm, activeCategory, faqs]);

  const toggleFAQ = (faqId) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(faqId)) {
      newOpenItems.delete(faqId);
    } else {
      newOpenItems.add(faqId);
    }
    setOpenItems(newOpenItems);
  };

  const handleFeedback = async (faqId, isHelpful) => {
    if (feedbackSubmitted.has(faqId)) return;

    try {
      const faq = faqs.find(f => f._id === faqId);
      if (!faq) return;

      const updateData = {
        helpfulCount: isHelpful ? faq.helpfulCount + 1 : faq.helpfulCount,
        notHelpfulCount: !isHelpful ? faq.notHelpfulCount + 1 : faq.notHelpfulCount
      };

      await axios.put(`/faqs/${faqId}`, updateData);
      
      // Update local state
      const updatedFaqs = faqs.map(f => 
        f._id === faqId 
          ? { 
              ...f, 
              helpfulCount: isHelpful ? f.helpfulCount + 1 : f.helpfulCount,
              notHelpfulCount: !isHelpful ? f.notHelpfulCount + 1 : f.notHelpfulCount
            }
          : f
      );
      
      setFaqs(updatedFaqs);
      setFeedbackSubmitted(prev => new Set(prev).add(faqId));
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || '❓';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            
            {/* Category filters skeleton */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
              ))}
            </div>
            
            {/* FAQ items skeleton */}
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-white font-serif pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about shopping, delivery, returns, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
              {/* <span className={`text-sm px-2 py-1 rounded-full ${
                activeCategory === category.id
                  ? 'bg-white text-orange-500'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {category.count}
              </span> */}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchFAQs}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-light text-gray-900 mb-2">
                No questions found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No results found for "${searchTerm}". Try searching with different keywords.`
                  : `No questions available in the ${activeCategory === 'all' ? 'selected categories' : activeCategory} category.`
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleFAQ(faq._id)}
                    className="w-full text-left p-6 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="text-2xl">{getCategoryIcon(faq.category)}</span>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 pr-8">
                          {faq.question}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                            {faq.category}
                          </span>
                          {(faq.helpfulCount > 0 || faq.notHelpfulCount > 0) && (
                            <span className="text-xs text-gray-500">
                              {faq.helpfulCount} found this helpful
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={`transform transition-transform duration-300 ${
                      openItems.has(faq._id) ? 'rotate-180' : ''
                    }`}>
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                  </button>

                  {openItems.has(faq._id) && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="pt-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                        
                        {/* Feedback Section */}
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-3">
                            Was this answer helpful?
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleFeedback(faq._id, true)}
                              disabled={feedbackSubmitted.has(faq._id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                feedbackSubmitted.has(faq._id)
                                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span>Yes</span>
                              {faq.helpfulCount > 0 && (
                                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                  {faq.helpfulCount}
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => handleFeedback(faq._id, false)}
                              disabled={feedbackSubmitted.has(faq._id)}
                              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                                feedbackSubmitted.has(faq._id)
                                  ? 'bg-red-100 text-red-700 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span>No</span>
                              {faq.notHelpfulCount > 0 && (
                                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                                  {faq.notHelpfulCount}
                                </span>
                              )}
                            </button>
                          </div>
                          
                          {feedbackSubmitted.has(faq._id) && (
                            <p className="text-sm text-green-600 mt-2">
                              Thank you for your feedback!
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
};

export default FAQ;