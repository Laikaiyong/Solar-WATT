import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

interface Product {
    name: string;
    price: number;
}

interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    created_at: string;
    total_amount: number;
    items: OrderItem[];
}

export default function OrderHistory({
    auth,
    orders,
}: {
    auth: any;
    orders: Order[];
}) {
    const [orderData, setOrderData] = useState<Order[]>(orders);

    // Fetch the user's order history with associated items
    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         try {
    //             const response = await axios.get("/orders"); // Adjust to the correct route
    //             console.log("Fetched Orders:", response.data); // Log the response data
    //             setOrders(response.data); // Assume backend returns an array of orders
    //         } catch (error) {
    //             console.error("Failed to fetch orders", error);
    //         }
    //     };

    //     fetchOrders();
    // }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Order History
                    </h2>
                </div>
            }
        >
            <Head title="Order History" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {orderData.length === 0 ? (
                                <p className="text-center text-gray-500">
                                    You haven't placed any orders yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                        <thead>
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Order Date</th>
                                                <th>Products</th>
                                                <th>Total Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orderData.map((order) => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {order.items.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            .name
                                                                    }{" "}
                                                                    (Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                    ) - RM{" "}
                                                                    {item.price.toFixed(
                                                                        2
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </td>
                                                    <td>
                                                        RM{" "}
                                                        {order.total_amount.toFixed(
                                                            2
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
