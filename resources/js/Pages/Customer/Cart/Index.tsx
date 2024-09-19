import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Adjust this path according to your folder structure
import { Head, Link } from "@inertiajs/react";
import axios from "axios";

const bucketLink = import.meta.env.VITE_S3_BUCKET_LINK || "";

// Define the CartItem interface
interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: string;
        image_path?: string; // Optional: Include the product image
    };
}

export default function Cart({ auth, cart, items }: { auth: any; cart: any; items: CartItem[] }) {
    const [cartItems, setCartItems] = useState<CartItem[]>(items); // Initialize with items passed from backend
    const [totalPrice, setTotalPrice] = useState<number>(0); // State to hold total price

    // Calculate the total price based on items
    useEffect(() => {
        calculateTotalPrice();
    }, [cartItems]);

    const calculateTotalPrice = () => {
        const total = cartItems.reduce((sum, item) => {
            return sum + item.quantity * parseFloat(item.product.price);
        }, 0);
        setTotalPrice(total);
    };

    // Function to update the quantity of a cart item
    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return; // Prevent negative or zero quantity

        try {
            const response = await axios.put(`/cart-items/${itemId}`, { quantity: newQuantity });
            const updatedItem = response.data;

            // Update cartItems state
            const updatedCartItems = cartItems.map((item) =>
                item.id === itemId ? { ...item, quantity: updatedItem.quantity } : item
            );
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    // Function to remove an item from the cart
    const removeItem = async (itemId: number) => {
        try {
            await axios.delete(`/cart-items/${itemId}`);
            // Remove item from cartItems state
            const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedCartItems);
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}  // Ensure the authenticated user is passed here
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Your Cart
                    </h2>

                    {/* Checkout Button */}
                    <Link href="/checkout" className="text-sm text-green-500 hover:text-green-700">
                        Proceed to Checkout
                    </Link>
                </div>
            }
        >
            <Head title="Your Cart" />
            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {cartItems.length === 0 ? (
                                <p className="text-center text-gray-500">Your cart is empty.</p>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-semibold mb-6">Cart Summary</h3>

                                    {/* Cart Items */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg p-4">
                                                {/* Product Image */}
                                                {item.product.image_path ? (
                                                    <img
                                                        src={bucketLink + item.product.image_path}
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

                                                {/* Quantity Controls */}
                                                <div className="flex justify-between items-center mt-4">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-4">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    Remove Item
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total Price */}
                                    <div className="mt-6 p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                        <h3 className="text-xl font-semibold">Total Price</h3>
                                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                                            RM {totalPrice.toFixed(2)}
                                        </p>
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
