import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, Calendar, MapPin, ArrowRight, ShoppingBag, Truck, CheckCircle, Clock, XCircle, Star } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../utils/axios';
import ReviewModal from '../components/ReviewModal';
import CancelModal from '../components/CancelModal';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [itemToCancel, setItemToCancel] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    // Generate SEO details based on orders
    const seoDetails = useMemo(() => {
        const orderCount = orders.length;
        const brandName = "StyleCart";
        
        if (orderCount === 0) {
            return {
                title: `My Orders | ${brandName}`,
                description: `View and manage your orders at ${brandName}. Track your purchases, check order status, and manage returns or cancellations.`,
                keywords: "my orders, order history, track orders, order status, StyleCart"
            };
        }

        const recentOrders = orders.slice(0, 3);
        const statusCounts = {
            delivered: 0,
            shipped: 0,
            processing: 0,
            placed: 0,
            cancelled: 0
        };

        orders.forEach(order => {
            order.items?.forEach(item => {
                statusCounts[item.status]++;
            });
        });

        return {
            title: `My Orders (${orderCount} orders) | ${brandName}`,
            description: `Manage ${orderCount} orders at StyleCart. Track deliveries, view order history, and manage returns. Current status: ${statusCounts.delivered} delivered, ${statusCounts.shipped} shipped, ${statusCounts.processing} processing.`,
            keywords: `my orders, order tracking, order history, ${orderCount} orders, StyleCart orders`
        };
    }, [orders]);

   
    const brandName = "StyleCart";
    const canonicalUrl = `${window.location.origin}/orders`;

    // Fetch orders
    useEffect(() => {
        fetchOrders();
    }, []);

    // Update document title when loading completes
    useEffect(() => {
        if (!loading) {
            document.title = seoDetails.title;
            
            const metaDescElement = document.querySelector('meta[name="description"]');
            if (metaDescElement) {
                metaDescElement.setAttribute('content', seoDetails.description);
            }
        }
    }, [loading, seoDetails.title, seoDetails.description]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('/orders/user');
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    

    

    // Rest of your existing functions remain exactly the same
    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'shipped':
                return <Truck className="w-5 h-5 text-blue-600" />;
            case 'placed':
                return <Package className="w-5 h-5 text-orange-600" />;
            case 'processing':
                return <Clock className="w-5 h-5 text-orange-600" />;
            case 'cancelled':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <Package className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'placed':
                return 'bg-orange-100 text-orange-800';
            case 'processing':
                return 'bg-orange-100 text-orange-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCancellationStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleReviewClick = (product) => {
        setSelectedProduct(product);
        setShowReviewModal(true);
    };

    const handleReviewSubmitted = () => {
        toast.success('Thank you for your review!');
    };

    const canCancelItem = (item) => {
        return ['placed', 'processing'].includes(item.status) && !item.cancellationStatus;
    };

    const hasPendingCancellation = (item) => {
        return item.cancellationStatus === 'pending';
    };

    const isCancellationApproved = (item) => {
        return item.cancellationStatus === 'approved';
    };

    const isCancellationRejected = (item) => {
        return item.cancellationStatus === 'rejected';
    };

    const handleCancelClick = (order, item) => {
        setItemToCancel({ order, item });
        setShowCancelModal(true);
    };

    const handleCancelSubmit = async (reason, description) => {
        setCancelling(true);
        try {
            const response = await axios.post(
                `/cancel/${itemToCancel.order._id}/items/${itemToCancel.item._id}/request`,
                { 
                    reason, 
                    description: reason === 'Others' ? description : undefined 
                }
            );

            if (response.data.success) {
                toast.success('Cancellation request submitted. Waiting for admin approval.');
                setShowCancelModal(false);
                setItemToCancel(null);
                fetchOrders();
            } else {
                toast.error(response.data.message || 'Failed to submit cancellation request');
            }
        } catch (error) {
            console.error('Error submitting cancellation request:', error);
            toast.error(error.response?.data?.message || 'Failed to submit cancellation request');
        } finally {
            setCancelling(false);
        }
    };

    const canReviewProduct = (item) => {
        return item.status === 'delivered';
    };

    const getOverallOrderStatus = (order) => {
        const items = order.items || [];
        if (items.length === 0) return 'placed';

        const statusCounts = {
            delivered: 0,
            shipped: 0,
            processing: 0,
            placed: 0,
            cancelled: 0
        };

        items.forEach(item => {
            statusCounts[item.status]++;
        });

        const totalItems = items.length;

        if (statusCounts.delivered === totalItems) return 'delivered';
        if (statusCounts.cancelled === totalItems) return 'cancelled';
        if (statusCounts.shipped > 0) return 'shipped';
        if (statusCounts.processing > 0) return 'processing';
        return 'placed';
    };
    const structuredData = useMemo(() => {
        const orderCount = orders.length;
        
        if (orderCount === 0) {
            return [
                {
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "My Orders - StyleCart",
                    "description": "Order management page for StyleCart customers",
                    "url": canonicalUrl
                }
            ];
        }

        return [
            // WebPage Schema
            {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": seoDetails.title,
                "description": seoDetails.description,
                "url": canonicalUrl
            },
            // Breadcrumb Schema
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": window.location.origin
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "My Orders",
                        "item": canonicalUrl
                    }
                ]
            },
            // Order Collection Schema
            {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "My Orders",
                "description": "List of customer orders",
                "numberOfItems": orderCount,
                "itemListElement": orders.slice(0, 5).map((order, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Order",
                        "orderNumber": order._id,
                        "orderDate": order.createdAt,
                        "orderStatus": getOverallOrderStatus(order),
                        "price": order.totalAmount,
                        "priceCurrency": "INR",
                        "acceptedOffer": order.items?.map(item => ({
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Product",
                                "name": item.product?.productName,
                                "image": item.product?.images?.[0]?.url,
                                "brand": {
                                    "@type": "Brand",
                                    "name": item.product?.brand
                                }
                            },
                            "price": item.product?.price,
                            "priceCurrency": "INR",
                            "eligibleQuantity": {
                                "@type": "QuantitativeValue",
                                "value": item.quantity
                            }
                        }))
                    }
                }))
            }
        ];
    }, [orders]);


    if (loading) {
        return (
            <>
                <Helmet>
                    <title>My Orders | StyleCart</title>
                    <meta name="description" content="Loading your order history..." />
                </Helmet>
                <div className="min-h-screen flex items-center justify-center bg-cream-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your orders...</p>
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
                <meta property="og:image" content={`${window.location.origin}/stylecart-orders-og.jpg`} />
                <meta property="og:site_name" content="StyleCart" />

                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={seoDetails.title} />
                <meta name="twitter:description" content={seoDetails.description} />
                <meta name="twitter:image" content={`${window.location.origin}/stylecart-orders-twitter.jpg`} />

                {/* Additional SEO Meta Tags */}
                <meta name="robots" content="noindex, nofollow" /> {/* Orders pages typically noindex */}
                <meta name="author" content="StyleCart" />

                {/* Structured Data */}
                {structuredData.map((data, index) => (
                    <script key={index} type="application/ld+json">
                        {JSON.stringify(data)}
                    </script>
                ))}
            </Helmet>

            <div className="min-h-screen font-serif bg-cream-white py-8">
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    theme="light"
                />

                {/* Hidden SEO Heading */}
                <h1 className="sr-only">{seoDetails.title}</h1>

                {/* Review Modal */}
                <ReviewModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    product={selectedProduct}
                    onReviewSubmitted={handleReviewSubmitted}
                />

                {/* Cancel Modal */}
                <CancelModal
                    isOpen={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                    item={itemToCancel?.item}
                    onCancelSubmit={handleCancelSubmit}
                    loading={cancelling}
                />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">My Orders</h2>
                                <p className="text-gray-600 mt-2 font-sans">
                                    {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
                                </p>
                            </div>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 font-sans"
                            >
                                Continue Shopping
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6 font-sans">
                        Once your item is shipped, you will be able to view the delivery date here.
                    </p>

                    {orders.length === 0 ? (
                        <div className="text-center py-16">
                            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-semibold text-gray-700 mb-4 font-serif">No orders yet</h3>
                            <p className="text-gray-600 mb-8 font-sans">Start shopping to see your orders here</p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors duration-200 font-sans"
                            >
                                Start Shopping
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const overallStatus = getOverallOrderStatus(order);
                                return (
                                    <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        {/* Order Header */}
                                        <div className="p-4 border-b border-gray-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <Package className="w-5 h-5 text-orange-500" />
                                                    <div>
                                                        <h3 className="text-base font-semibold text-gray-900 font-sans">
                                                            Order #{order._id.slice(-8).toUpperCase()}
                                                        </h3>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                                <span className="text-xs text-gray-600 font-sans">
                                                                    {formatDate(order.createdAt)}
                                                                </span>
                                                            </div>
                                                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(overallStatus)}`}>
                                                                {getStatusIcon(overallStatus)}
                                                                <span className="capitalize">{overallStatus}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-base font-bold text-gray-900 font-sans">
                                                        ₹{order.totalAmount?.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-gray-600 font-sans">
                                                        {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order Items Preview - Compact */}
                                        <div className="p-4">
                                            <div className="flex items-center justify-between">
                                                {/* Items Preview - Compact */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 overflow-x-auto">
                                                        {order.items?.map((item, index) => (
                                                            <div key={index} className="flex items-center gap-2 flex-shrink-0">
                                                                <img
                                                                    src={item.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                                                                    alt={item.product?.productName}
                                                                    className="w-14 h-14 object-cover rounded border border-gray-200"
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 truncate font-sans max-w-[120px]">
                                                                        {item.product?.productName}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 font-sans">
                                                                        Size: {item.size} • Qty: {item.quantity}
                                                                    </p>
                                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} mt-1`}>
                                                                        {getStatusIcon(item.status)}
                                                                        <span className="capitalize">{item.status}</span>
                                                                    </div>
                                                                    {hasPendingCancellation(item) && (
                                                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCancellationStatusColor('pending')} mt-1`}>
                                                                            <Clock className="w-3 h-3" />
                                                                            Cancellation Pending
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* View Details Button */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowOrderDetails(true);
                                                    }}
                                                    className="flex items-center text-orange-500 hover:text-orange-700 font-medium text-sm font-sans ml-4"
                                                >
                                                    View Details
                                                    <ArrowRight className="w-3 h-3 ml-1" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Order Details Modal */}
                {showOrderDetails && selectedOrder && (
                    <div className="fixed inset-0 bg-black/70 transition-opacity flex items-center justify-center z-30 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold font-sans">
                                    Order Details - #{selectedOrder._id.slice(-8).toUpperCase()}
                                </h3>
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Order Date */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-sans">Order Date</p>
                                        <p className="text-sm font-medium text-gray-900 font-sans">
                                            {formatDateTime(selectedOrder.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 font-serif">Order Items</h4>
                                    <div className="space-y-4">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                                                <img
                                                    src={item.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                                                    alt={item.product?.productName}
                                                    className="w-16 h-16 object-cover rounded border border-gray-200"
                                                />
                                                <div className="flex-1">
                                                    <h5 className="font-medium text-gray-900 font-sans">
                                                        {item.product?.productName}
                                                    </h5>
                                                    <p className="text-sm text-gray-500 font-sans">
                                                        {item.product?.brand}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 font-sans">
                                                        <span>Size: {item.size}</span>
                                                        <span>Quantity: {item.quantity}</span>
                                                        {item.product?.color && (
                                                            <span>Color: {item.product.color}</span>
                                                        )}
                                                    </div>
                                                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)} mt-2`}>
                                                        {getStatusIcon(item.status)}
                                                        <span className="capitalize">{item.status}</span>
                                                    </div>
                                                    
                                                    {/* Cancellation Status */}
                                                    {hasPendingCancellation(item) && (
                                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCancellationStatusColor('pending')} mt-2`}>
                                                            <Clock className="w-3 h-3" />
                                                            Cancellation Request Pending
                                                            {item.cancellationReason && (
                                                                <span className="ml-1">- {item.cancellationReason}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {isCancellationApproved(item) && (
                                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCancellationStatusColor('approved')} mt-2`}>
                                                            <CheckCircle className="w-3 h-3" />
                                                            Cancellation Approved
                                                            {item.cancellationReason && (
                                                                <span className="ml-1">- {item.cancellationReason}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {isCancellationRejected(item) && (
                                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCancellationStatusColor('rejected')} mt-2`}>
                                                            <XCircle className="w-3 h-3" />
                                                            Cancellation Rejected
                                                            {item.cancellationReason && (
                                                                <span className="ml-1">- {item.cancellationReason}</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Cancellation Description for "Others" */}
                                                    {item.cancellationDescription && (
                                                        <div className="mt-2 p-2 bg-gray-50 rounded border">
                                                            <p className="text-xs text-gray-600 font-medium">Additional Details:</p>
                                                            <p className="text-sm text-gray-700">{item.cancellationDescription}</p>
                                                        </div>
                                                    )}

                                                    {/* Admin Notes */}
                                                    {item.adminNotes && (
                                                        <div className="mt-2 p-2 bg-blue-50 rounded border">
                                                            <p className="text-xs text-blue-600 font-medium">Admin Response:</p>
                                                            <p className="text-sm text-blue-700">{item.adminNotes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <p className="text-lg font-bold text-gray-900 font-sans">
                                                        ₹{(item.product?.price * item.quantity)?.toLocaleString()}
                                                    </p>
                                                    {canCancelItem(item) && (
                                                        <button
                                                            onClick={() => handleCancelClick(selectedOrder, item)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors duration-200 font-sans"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Request Cancellation
                                                        </button>
                                                    )}
                                                    {canReviewProduct(item) && (
                                                        <button
                                                            onClick={() => handleReviewClick(item.product)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors duration-200 font-sans"
                                                        >
                                                            <Star className="w-4 h-4" />
                                                            Write Review
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 font-serif flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                        Shipping Address
                                    </h4>
                                    {selectedOrder.shippingAddress && (
                                        <div className="p-4 border border-gray-200 rounded-lg">
                                            <div className="text-sm text-gray-600 space-y-2 font-sans">
                                                <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                                                <p>{selectedOrder.shippingAddress.houseNumber}, {selectedOrder.shippingAddress.street}</p>
                                                {selectedOrder.shippingAddress.landmark && (
                                                    <p>Landmark: {selectedOrder.shippingAddress.landmark}</p>
                                                )}
                                                <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}</p>
                                                <p>Country: {selectedOrder.shippingAddress.country}</p>
                                                <p>Phone: {selectedOrder.shippingAddress.mobileNumber}</p>
                                                {selectedOrder.shippingAddress.isDefault && (
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                        Default Address
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 font-serif">Order Summary</h4>
                                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 font-sans">
                                        <div className="flex justify-between">
                                            <span>Items Total:</span>
                                            <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Shipping:</span>
                                            <span className="text-green-600">FREE</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2">
                                            <div className="flex justify-between font-semibold">
                                                <span>Total Amount:</span>
                                                <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end p-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 font-sans"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrdersPage;