import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"; // Ensure this path is correct
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Link } from "@inertiajs/react";

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

export default function Cart({ auth }: { auth: any }) { // Accept `auth` prop for AuthenticatedLayout
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // State to hold cart items
    const [totalPrice, setTotalPrice] = useState<number>(0); // State to hold total price

    // Function to fetch the cart items from the API
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('/carts'); // Adjust endpoint as needed
            if (response.data && response.data.items) {
                setCartItems(response.data.items); // Assuming `items` contains the cart products

                // Calculate the total price
                const total = response.data.items.reduce((sum: number, item: CartItem) => {
                    return sum + item.quantity * parseFloat(item.product.price);
                }, 0);
                setTotalPrice(total);
            } else {
                console.error("No cart items found");
            }
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
        }
    };

    // useEffect to fetch cart items when the component mounts
    useEffect(() => {
        fetchCartItems();
    }, []); // Empty dependency array means this will only run once when the component mounts

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Your Cart
                    </h2>

                    {/* back to Product Button */}
                    <Link href="/product-list" className="text-sm text-blue-500 hover:text-blue-700">
                        Back to Product List 
                    </Link>
                </div>
            }
        >
            <Head title="Your Cart" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                {cartItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            <h3 className="text-xl font-semibold">Cart Summary</h3>
                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                                <strong>Total Price:</strong> RM {totalPrice.toFixed(2)}
                            </p>
                            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Proceed to Checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
