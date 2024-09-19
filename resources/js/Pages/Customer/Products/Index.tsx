import { Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

interface Product {
    id: number;
    name: string;
    description?: string;
    type: "Product" | "Service";
    price?: string;
    availability: string;
    solar_site: {
        id: number;
        name: string;
    } | null;
    image_url?: string; // Optional field to handle product images
}

// Define a CartItem interface to represent the structure of a cart item
interface CartItem {
    id: number;
    product_id: number;
    cart_id: number;
    quantity: number;
}

export default function Index({
    auth,
    products,
}: {
    auth: any;
    products: Product[];
}) {
    const { setData, post, reset } = useForm({
        product_id: 0,
        quantity: 1,
        cart_id: null as number | null, // Initialize cart_id as number or null
    });

    const [cartItems, setCartItems] = useState<number>(0); // State for tracking the number of items in the cart
    const [cartId, setCartId] = useState<number | null>(null); // State to store the cart ID

    // Automatically fetch or create the cart when the component mounts
    useEffect(() => {
        const initializeCart = async () => {
            await fetchOrCreateCart();
        };
        initializeCart();
    }, []);

    // Function to fetch or create the cart for the user
    const fetchOrCreateCart = async (): Promise<number | null> => {
        try {
            console.log("Attempting to create or fetch a cart...");
            const response = await axios.get('/carts'); // Fetch cart and its items

            if (response.data && response.data.id) {
                console.log("Cart fetched successfully:", response.data);
                setCartId(response.data.id); // Set the cart ID
                
                // Set the cart items count based on the items fetched
                if (response.data.items && response.data.items.length > 0) {
                    setCartItems(
                        response.data.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0)
                    ); // Sum of quantities in the cart
                } else {
                    setCartItems(0); // If no items, set cart items count to 0
                }

                return response.data.id; // Return the cart ID directly
            } else {
                console.error("No cart returned from the server.");
                return null;
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            return null;
        }
    };

    // Function to add a product to the cart
    const addToCart = async (productId: number) => {
        let currentCartId = cartId;

        // If no cart ID, fetch or create one
        if (!currentCartId) {
            currentCartId = await fetchOrCreateCart();
        }

        // If cart ID is still null, stop execution
        if (!currentCartId) {
            console.error('Failed to fetch or create a cart.');
            return;
        }

        console.log('Adding product to cart', productId);

        try {
            // Directly using axios to POST the product to the cart
            const response = await axios.post('/cart-items', {
                product_id: productId,
                quantity: 1,
                cart_id: currentCartId, // Send the cart_id directly
            });

            console.log('Item added to cart:', response.data);
            setCartItems(cartItems + 1); // Increment cart items count

            // Show success message using Toast
            toast.success('Item added to cart successfully!', {
                position: "top-right",
                autoClose: 3000, // Auto closes after 3 seconds
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            // Check if the error is an AxiosError
            if (error instanceof AxiosError) {
                // Access the response data from AxiosError
                console.error("Failed to add item to cart", error.response?.data);
            } else {
                // Handle non-Axios errors
                console.error("An unexpected error occurred:", error);
            }
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Solar Products & Services
                    </h2>

                    {/* Cart Button */}
                    <Link href="/cart" className="text-sm text-blue-500 hover:text-blue-700">
                        View Cart ({cartItems})
                    </Link>
                </div>
            }
        >
            <Head title="Solar Products & Services" />
            <ToastContainer /> {/* Add ToastContainer to show toast notifications */}
            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {products.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No products or services available.
                                </div>
                            )}

                            {/* Product Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                {products.map((product) => (
                                    <div key={product.id} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                                                <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                                            </div>
                                        )}

                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                                {product.description || "No description available."}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <strong>Type:</strong> {product.type}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <strong>Availability:</strong> {product.availability}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <strong>Price:</strong> {product.price ? `RM${parseFloat(product.price).toFixed(2)}` : "N/A"}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <strong>Site Name:</strong> {product.solar_site?.name || "N/A"}
                                            </p>

                                            {/* Add to Cart Button */}
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
