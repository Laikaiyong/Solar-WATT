import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Adjust this path according to your folder structure
import { Head } from "@inertiajs/react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// Define the CartItem interface
interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: string;
        image_url?: string; // Optional: Include the product image
    };
}

export default function Checkout({ auth, cart, items }: { auth: any; cart: any; items: CartItem[] }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(items); // Initialize with items passed from backend
    const [totalPrice, setTotalPrice] = useState<number>(0); // State to hold total price

    // Calculate the total price based on items
    useEffect(() => {
        const total = items.reduce((sum, item) => {
            return sum + item.quantity * parseFloat(item.product.price);
        }, 0);
        setTotalPrice(total);
    }, [items]);

    // Function to clear all cart items
    const clearCart = async () => {
        try {
            // API call to clear the cart
            await axios.delete(`/carts/${cart.id}/clear`);
            setCartItems([]);  // Clear cart items from state
            console.log('Cart cleared successfully');
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    // Function to handle the checkout process
    const handleCheckout = async () => {
        try {
            const response = await axios.post('/orders', {
                items: cartItems,  // Pass the cart items directly
                total: totalPrice,
            });

            // Show success message using toast
            toast.success('Order placed successfully!', {
                position: "top-right",
                autoClose: 3000,  // Auto closes after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            // Clear the cart after placing the order
            await clearCart();
        } catch (error) {
            console.error('Failed to place the order:', error);
            toast.error('Failed to place the order!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}  // Ensure the authenticated user is passed here
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Checkout
                    </h2>
                </div>
            }
        >
            <Head title="Checkout" />
            <ToastContainer /> {/* Add ToastContainer to show toast notifications */}
            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500">Your cart is empty. Please add items before checking out.</p>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-semibold mb-6">Order Summary</h3>

                                    {/* Cart Items */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg p-4">
                                                {/* Product Image */}
                                                {item.product.image_url ? (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product.name}
                                                        className="w-full h-48 object-cover mb-4"
                                                    />
                                                ) : (
                                                    <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 flex items-center justify-center mb-4">
                                                        <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                                                    </div>
                                                )}

                                                {/* Product Details */}
                                                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-600">Price per item: RM {parseFloat(item.product.price).toFixed(2)}</p>
                                                <p className="text-sm text-gray-600 mt-2">
                                                    <strong>Total for this item:</strong> RM {(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Price */}
                                    <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                        <h3 className="text-xl font-semibold">Total Price</h3>
                                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                                            RM {totalPrice.toFixed(2)}
                                        </p>

                                        {/* Checkout Button */}
                                        <button
                                            onClick={handleCheckout}
                                            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Confirm and Place Order
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
