import React, { useState } from 'react';

const SizeGuide = () => {
  const [activeGender, setActiveGender] = useState('women');

  const clothingSizes = {
    women: {
      tops: [
        { size: 'XS', chest: '32-34"', waist: '24-26"', hip: '34-36"' },
        { size: 'S', chest: '34-36"', waist: '26-28"', hip: '36-38"' },
        { size: 'M', chest: '36-38"', waist: '28-30"', hip: '38-40"' },
        { size: 'L', chest: '38-40"', waist: '30-32"', hip: '40-42"' },
        { size: 'XL', chest: '40-42"', waist: '32-34"', hip: '42-44"' },
        { size: 'XXL', chest: '42-44"', waist: '34-36"', hip: '44-46"' }
      ],
      bottoms: [
        { size: 'XS', waist: '24-26"', hip: '34-36"', inseam: '30"' },
        { size: 'S', waist: '26-28"', hip: '36-38"', inseam: '30"' },
        { size: 'M', waist: '28-30"', hip: '38-40"', inseam: '30"' },
        { size: 'L', waist: '30-32"', hip: '40-42"', inseam: '30"' },
        { size: 'XL', waist: '32-34"', hip: '42-44"', inseam: '30"' },
        { size: 'XXL', waist: '34-36"', hip: '44-46"', inseam: '30"' }
      ],
      dresses: [
        { size: 'XS', bust: '32-33"', waist: '24-25"', hip: '34-35"' },
        { size: 'S', bust: '34-35"', waist: '26-27"', hip: '36-37"' },
        { size: 'M', bust: '36-37"', waist: '28-29"', hip: '38-39"' },
        { size: 'L', bust: '38-39"', waist: '30-31"', hip: '40-41"' },
        { size: 'XL', bust: '40-41"', waist: '32-33"', hip: '42-43"' }
      ]
    },
    men: {
      tops: [
        { size: 'XS', chest: '34-36"', waist: '28-30"', hip: '34-36"' },
        { size: 'S', chest: '36-38"', waist: '30-32"', hip: '36-38"' },
        { size: 'M', chest: '38-40"', waist: '32-34"', hip: '38-40"' },
        { size: 'L', chest: '40-42"', waist: '34-36"', hip: '40-42"' },
        { size: 'XL', chest: '42-44"', waist: '36-38"', hip: '42-44"' },
        { size: 'XXL', chest: '44-46"', waist: '38-40"', hip: '44-46"' }
      ],
      bottoms: [
        { size: 'XS', waist: '28-30"', hip: '34-36"', inseam: '32"' },
        { size: 'S', waist: '30-32"', hip: '36-38"', inseam: '32"' },
        { size: 'M', waist: '32-34"', hip: '38-40"', inseam: '32"' },
        { size: 'L', waist: '34-36"', hip: '40-42"', inseam: '32"' },
        { size: 'XL', waist: '36-38"', hip: '42-44"', inseam: '32"' },
        { size: 'XXL', waist: '38-40"', hip: '44-46"', inseam: '32"' }
      ],
      suits: [
        { size: '36S', chest: '36"', waist: '29-31"', sleeve: '31"' },
        { size: '38R', chest: '38"', waist: '31-33"', sleeve: '32"' },
        { size: '40R', chest: '40"', waist: '33-35"', sleeve: '32"' },
        { size: '42R', chest: '42"', waist: '35-37"', sleeve: '33"' },
        { size: '44R', chest: '44"', waist: '37-39"', sleeve: '33"' }
      ]
    }
  };

  // Function to render measurement values with sans-serif font
  const MeasurementValue = ({ value }) => (
    <span className="font-sans">{value}</span>
  );

  return (
    <div className="min-h-screen font-serif bg-cream-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Clothing Size Guide
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Find your perfect fit with our detailed clothing measurements. All sizes in inches.
          </p>
        </div>

        {/* Gender Selection */}
        <div className=" p-8 mb-12 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Gender</h2>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <button
              onClick={() => setActiveGender('women')}
              className={`px-8 py-4 rounded-full border-2 transition-all duration-300 ${
                activeGender === 'women'
                  ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                  : 'border-amber-200 text-gray-700 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              Women's Sizes
            </button>
            <button
              onClick={() => setActiveGender('men')}
              className={`px-8 py-4 rounded-full border-2 transition-all duration-300 ${
                activeGender === 'men'
                  ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                  : 'border-amber-200 text-gray-700 hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              Men's Sizes
            </button>
          </div>
        </div>

        {/* Tops Size Chart */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12 border border-amber-50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👕</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {activeGender === 'women' ? "Women's" : "Men's"} Tops & Shirts
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-amber-200">
                  <th className="pb-4 font-semibold text-gray-800 text-center">Size</th>
                  <th className="pb-4 font-semibold text-gray-800 text-center">Chest</th>
                  <th className="pb-4 font-semibold text-gray-800 text-center">Waist</th>
                  <th className="pb-4 font-semibold text-gray-800 text-center">Hip</th>
                </tr>
              </thead>
              <tbody>
                {clothingSizes[activeGender].tops.map((size, index) => (
                  <tr 
                    key={size.size} 
                    className={`${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'} border-b border-amber-100 hover:bg-amber-100 transition-colors duration-200`}
                  >
                    <td className="py-4 font-semibold text-gray-800 text-center">{size.size}</td>
                    <td className="py-4 text-gray-600 text-center">
                      <MeasurementValue value={size.chest} />
                    </td>
                    <td className="py-4 text-gray-600 text-center">
                      <MeasurementValue value={size.waist} />
                    </td>
                    <td className="py-4 text-gray-600 text-center">
                      <MeasurementValue value={size.hip} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottoms Size Chart */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12 border border-amber-50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {activeGender === 'women' ? "Women's" : "Men's"} Bottoms
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-amber-200">
                  <th className="pb-4 font-semibold text-gray-800 text-center">Size</th>
                  <th className="pb-4 font-semibold text-gray-800 text-center">Waist</th>
                  <th className="pb-4 font-semibold text-gray-800 text-center">Hip</th>
                  <th className="pb-4 font-semibold text-gray-800 text-center">Inseam</th>
                </tr>
              </thead>
              <tbody>
                {clothingSizes[activeGender].bottoms.map((size, index) => (
                  <tr 
                    key={size.size} 
                    className={`${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'} border-b border-amber-100 hover:bg-amber-100 transition-colors duration-200`}
                  >
                    <td className="py-4 font-semibold text-gray-800 text-center">{size.size}</td>
                    <td className="py-4 text-gray-600 text-center">
                      <MeasurementValue value={size.waist} />
                    </td>
                    <td className="py-4 text-gray-600 text-center">
                      <MeasurementValue value={size.hip} />
                    </td>
                    <td className="py-4 text-gray-600 text-center">
                      <MeasurementValue value={size.inseam} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Specialized Charts */}
        {activeGender === 'women' && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-12 border border-amber-50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👗</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Women's Dresses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    <th className="pb-4 font-semibold text-gray-800 text-center">Size</th>
                    <th className="pb-4 font-semibold text-gray-800 text-center">Bust</th>
                    <th className="pb-4 font-semibold text-gray-800 text-center">Waist</th>
                    <th className="pb-4 font-semibold text-gray-800 text-center">Hip</th>
                  </tr>
                </thead>
                <tbody>
                  {clothingSizes.women.dresses.map((size, index) => (
                    <tr 
                      key={size.size} 
                      className={`${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'} border-b border-amber-100 hover:bg-amber-100 transition-colors duration-200`}
                    >
                      <td className="py-4 font-semibold text-gray-800 text-center">{size.size}</td>
                      <td className="py-4 text-gray-600 text-center">
                        <MeasurementValue value={size.bust} />
                      </td>
                      <td className="py-4 text-gray-600 text-center">
                        <MeasurementValue value={size.waist} />
                      </td>
                      <td className="py-4 text-gray-600 text-center">
                        <MeasurementValue value={size.hip} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeGender === 'men' && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-12 border border-amber-50">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👔</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Men's Suits & Blazers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    <th className="pb-4 font-semibold text-gray-800 text-center">Size</th>
                    <th className="pb-4 font-semibold text-gray-800 text-center">Chest</th>
                    <th className="pb-4 font-semibold text-gray-800 text-center">Waist</th>
                    <th className="pb-4 font-semibold text-gray-800 text-center">Sleeve</th>
                  </tr>
                </thead>
                <tbody>
                  {clothingSizes.men.suits.map((size, index) => (
                    <tr 
                      key={size.size} 
                      className={`${index % 2 === 0 ? 'bg-amber-50' : 'bg-white'} border-b border-amber-100 hover:bg-amber-100 transition-colors duration-200`}
                    >
                      <td className="py-4 font-semibold text-gray-800 text-center font-sans">{size.size}</td>
                      <td className="py-4 text-gray-600 text-center">
                        <MeasurementValue value={size.chest} />
                      </td>
                      <td className="py-4 text-gray-600 text-center">
                        <MeasurementValue value={size.waist} />
                      </td>
                      <td className="py-4 text-gray-600 text-center">
                        <MeasurementValue value={size.sleeve} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Measurement Guide */}
        <div className="bg-amber-50 rounded-lg p-8 mb-16 border border-amber-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">How to Measure Yourself</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📏</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Chest/Bust</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Measure around the fullest part of your chest, keeping the tape horizontal and under your arms
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Waist</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Measure around the natural waistline, keeping the tape comfortably snug but not tight
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Hips</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Measure around the fullest part of your hips, typically about 8 inches below your waist
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👣</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Inseam</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Measure from the crotch to the bottom of the ankle along the inner leg while standing straight
              </p>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border border-amber-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Perfect Fit Tips</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Accurate Measurements
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Always take your measurements while wearing lightweight clothing and compare them with our size chart before ordering
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Fit Preference
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Choose a size up if you prefer a looser fit, or size down for a more tailored look depending on your style
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Fabric Considerations
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Some materials have less stretch - check product descriptions for specific fabric content and care instructions
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                International Sizing
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sizes may vary by region and brand. Always refer to our specific measurements rather than your usual size
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA
        <div className="text-center p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Sizing Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Unsure about your size or have specific fitting questions? Our style experts are here to assist you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 shadow-sm">
              Contact Style Expert
            </button>
            <button className="border border-amber-600 text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300">
              Live Chat Support
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SizeGuide;