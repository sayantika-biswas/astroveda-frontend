import React, { useState, useEffect, useMemo } from "react";
import { Plus, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async"; // Install: npm install react-helmet-async
import AddressModal from "../components/AddressModal";
import AddressCard from "../components/AddressCard";
import axios from '../utils/axios';

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sort addresses with default first
  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) => {
      // Default addresses come first
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      
      // If both have same default status, maintain original order
      return 0;
    });
  }, [addresses]);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/address");
      const fetchedAddresses = response.data.addresses || [];
      setAddresses(fetchedAddresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch addresses";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = (addressData) => {
    fetchAddresses();
    setEditingAddress(null);
    toast.success(addressData._id ? "Address updated successfully!" : "Address added successfully!");
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await axios.delete(`/address/${addressId}`);

        setAddresses(prev => {
          const filtered = prev.filter(addr => addr._id !== addressId);
          // If we deleted the default address, make the first remaining address default
          if (filtered.length > 0 && !filtered.some(addr => addr.isDefault)) {
            const updatedAddresses = filtered.map((addr, index) => ({
              ...addr,
              isDefault: index === 0 // Make first address default
            }));
            return updatedAddresses;
          }
          return filtered;
        });

        // toast.success("Address deleted successfully!");

      } catch (error) {
        console.error("Error deleting address:", error);
        const errorMessage = error.response?.data?.message || "Failed to delete address";
        toast.error(errorMessage);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.put(`/address/set-default/${addressId}`);

      // Update local state - set the selected address as default, others as non-default
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        }))
      );

      // toast.success("Default address updated successfully!");

    } catch (error) {
      console.error("Error setting default address:", error);
      const errorMessage = error.response?.data?.message || "Failed to set default address";
      toast.error(errorMessage);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  // Count addresses for SEO description
  const addressCount = addresses.length;
  const hasDefaultAddress = addresses.some(addr => addr.isDefault);

  return (
    <>
      {/* SEO Optimization */}
      <Helmet>
        <title>Manage Addresses | My Account</title>
        <meta 
          name="description" 
          content={`Manage your ${addressCount} delivery addresses. ${hasDefaultAddress ? 'Default address is set for quick checkout.' : 'Set a default address for faster deliveries.'} Add, edit, or remove addresses.`}
        />
        <meta name="keywords" content="delivery addresses, shipping addresses, address management, default address, account settings" />
        <meta property="og:title" content="Address Management | My Account" />
        <meta property="og:description" content="Manage your delivery addresses for faster checkout and accurate deliveries" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/address-management" />
      </Helmet>

      <div className="max-w-4xl font-serif mx-auto p-6">
        {/* Header with semantic HTML */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-full" aria-hidden="true">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
              {/* <p className="text-gray-600">
                {addressCount === 0 
                  ? "Manage your delivery addresses" 
                  : `You have ${addressCount} address${addressCount !== 1 ? 'es' : ''}`
                }
                {hasDefaultAddress && " • Default address set"}
              </p> */}
            </div>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
            disabled={isLoading}
            aria-label="Add new address"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </header>

        {/* Loading State */}
        {isLoading && addresses.length === 0 && (
          <div className="text-center py-12" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto" aria-hidden="true"></div>
            <p className="text-gray-600 mt-4">Loading addresses...</p>
          </div>
        )}

        {/* Main Content */}
        <main>
          {/* Empty State */}
          {!isLoading && addresses.length === 0 ? (
            <section className="text-center py-12" aria-labelledby="empty-address-title">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <h2 id="empty-address-title" className="text-lg font-semibold text-gray-600 mb-2">
                No addresses saved
              </h2>
              <p className="text-gray-500 mb-4">Add your first address to get started with faster checkouts</p>
              <button
                onClick={openAddModal}
                className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
              >
                Add Your First Address
              </button>
            </section>
          ) : (
            <section aria-labelledby="addresses-list-title">
              <h2 id="addresses-list-title" className="sr-only">Your Addresses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedAddresses.map((address, index) => (
                  <article 
                    key={address._id} 
                    className="relative"
                    aria-labelledby={`address-${address._id}-title`}
                  >
                    <AddressCard
                      address={address}
                      onEdit={handleEditAddress}
                      onDelete={handleDeleteAddress}
                      isDefault={address.isDefault}
                      // Add these props to AddressCard for better accessibility
                      ariaLabel={`Address ${index + 1}${address.isDefault ? ', Default address' : ''}`}
                    />
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefault(address._id)}
                        className="mt-2 text-sm text-orange-400 hover:text-orange-500 transition-colors disabled:opacity-50 focus:outline-none focus:underline"
                        disabled={isLoading}
                        aria-label={`Set address ${index + 1} as default`}
                      >
                        Set as Default
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Modal */}
        <AddressModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveAddress}
          editAddress={editingAddress}
        />
      </div>
    </>
  );
};

export default AddressManagement;