import React from 'react';

const ShippingInfo = () => {
  return (
    <div className="min-h-screen font-serif bg-cream-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Shipping Information
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We deliver your products with care and precision, ensuring they reach you safely and on time.
          </p>
        </div>

        {/* Shipping Options Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🚚</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Standard Shipping</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Reliable delivery within 5-7 business days. Perfect for regular orders that don't require expedited handling.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                5-7 business days
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Free on orders over $50
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                $5.99 for orders under $50
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Express Shipping</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Get your orders faster with our priority express service. Ideal for time-sensitive deliveries.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                2-3 business days
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                $12.99 flat rate
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Order by 2 PM for same-day dispatch
              </li>
            </ul>
          </div>
        </div>

        {/* Shipping Process Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16 border border-amber-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Shipping Process</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              We take great care in preparing your orders for shipment. Each product is carefully inspected, securely packaged, and handled with the utmost attention to ensure it arrives in perfect condition.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">Orders are processed within 24 hours of placement</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Quality Check</h3>
                <p className="text-sm text-gray-600">Every item undergoes thorough inspection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚛</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Careful Dispatch</h3>
                <p className="text-sm text-gray-600">Securely packaged and shipped with tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Areas Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Delivery Areas & Times</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-3">🇺🇸</span>
                Domestic Shipping
              </h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></span>
                  <span>All 50 states covered</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></span>
                  <span>Rural areas may have extended delivery times</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></span>
                  <span>Weekend delivery available in select areas</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-amber-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-3">🌍</span>
                International Shipping
              </h3>
              <ul className="text-gray-600 space-y-3">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></span>
                  <span>Available to 30+ countries</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></span>
                  <span>7-14 business days delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 mt-2"></span>
                  <span>Customs and import duties may apply</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tracking & Support Section */}
        <div className="bg-amber-50 rounded-lg p-8 mb-16 border border-amber-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Order Tracking & Support</h2>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6">
              Stay informed about your order every step of the way with our comprehensive tracking system.
            </p>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Real-time Tracking
                </h4>
                <p className="text-gray-600 text-sm">
                  Track your package from dispatch to delivery with live updates and estimated arrival times.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Delivery Notifications
                </h4>
                <p className="text-gray-600 text-sm">
                  Receive email and SMS notifications at key delivery milestones.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Shipping Support
                </h4>
                <p className="text-gray-600 text-sm">
                  Our support team is available to help with any shipping questions or concerns.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                  Safe Delivery
                </h4>
                <p className="text-gray-600 text-sm">
                  Contactless delivery options available upon request for your safety and convenience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border border-amber-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Important Shipping Notes</h2>
          <div className="max-w-3xl mx-auto text-left">
            <div className="space-y-4 text-gray-600">
              <p className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Shipping times are estimates and may be affected by weather, holidays, or carrier delays</span>
              </p>
              <p className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Signature may be required for delivery of high-value items</span>
              </p>
              <p className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Please ensure your shipping address is correct at checkout</span>
              </p>
              <p className="flex items-start">
                <span className="text-amber-500 mr-3">•</span>
                <span>Contact us within 24 hours of delivery for any shipping-related issues</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Shipping?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions about your order's shipping status or need assistance? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 shadow-sm">
              Track Your Order
            </button>
            <button className="border border-amber-600 text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;