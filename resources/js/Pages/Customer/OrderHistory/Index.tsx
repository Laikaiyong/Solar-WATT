import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    status: string;
    items: OrderItem[];
    created_at: string;
    total_amount: number;
}

interface Product {
    id: number;
    name: string;
    price: number;
}

export default function OrderHistory({
    auth,
    orders,
}: {
    auth: any;
    orders: Order[];
}) {
    const [orderData, setOrderData] = useState<Order[]>(orders);
    const [products, setProducts] = useState<{ [key: number]: Product }>({});

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const productIds = new Set(
                    orders.flatMap((order) =>
                        order.items.map((item) => item.product_id)
                    )
                );

                const response = await axios.get("/product-details", {
                    params: { ids: Array.from(productIds) },
                });
                const productDetails = response.data;
                const productMap = productDetails.reduce(
                    (acc: { [key: number]: Product }, product: Product) => {
                        acc[product.id] = product;
                        return acc;
                    },
                    {}
                );

                setProducts(productMap);
            } catch (error) {
                console.error("Failed to fetch product details", error);
            }
        };

        fetchProductDetails();
    }, [orders]);

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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {orderData.length === 0 ? (
                                <p className="text-center text-gray-500 mt-6">
                                    You haven't placed any orders yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-100 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Order Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Products
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Total Price
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {orderData.map((order) => (
                                                <tr key={order.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {new Date(
                                                            order.created_at
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {order.items.map(
                                                            (item) => {
                                                                const product =
                                                                    products[
                                                                        item
                                                                            .product_id
                                                                    ];
                                                                return (
                                                                    <div
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        {product ? (
                                                                            <>
                                                                                {
                                                                                    product.name
                                                                                }
                                                                            </>
                                                                        ) : (
                                                                            <span>
                                                                                Product
                                                                                name
                                                                                not
                                                                                found
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        RM{" "}
                                                        {Number(
                                                            order.total_amount
                                                        ).toFixed(2)}
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
