import { useState, useEffect } from "react";
import axios from "axios";

interface CartItem {
    id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: string;
    };
}

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]); // State to hold cart items

    // Function to fetch the cart items from the API
    const fetchCartItems = async () => {
        try {
            const response = await axios.get('/carts'); // Adjust endpoint as needed
            if (response.data && response.data.items) {
                setCartItems(response.data.items); // Assuming `items` contains the cart products
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
        <div>
            <h2>Your Cart</h2>
            {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <p>{item.product.name} - Quantity: {item.quantity}</p>
                        <p>Price: RM {parseFloat(item.product.price).toFixed(2)}</p>
                    </div>
                ))
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
}
