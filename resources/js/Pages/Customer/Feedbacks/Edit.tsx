import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";

interface Order {
    id: number;
    created_at: string;
    total_amount: number;
    product_id: number;
}

interface Feedback {
    id: number;
    message: string;
    product_id: number;
}

export default function Edit({
    auth,
    feedbacks,
}: {
    auth: any;
    feedbacks: Feedback;
}) {
    const { data, setData, put } = useForm({
        user_id: auth.user.id!,
        message: feedbacks?.message || "",
        product_id: feedbacks?.product_id || "", // Stores product_id
        order_id: "", // New field to store the order_id
    });

    const [formErrors, setFormErrors] = useState<any>({});
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    // Fetch the user's orders when the component mounts
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("/get-user-orders");
                setOrders(response.data.orders || []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                setOrders([]);
            }
        };

        fetchOrders();
    }, []);

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.message) {
            newErrors.message = "Message is required.";
            isValid = false;
        }

        // Validate selectedOrderId instead of product_id
        if (!selectedOrderId) {
            newErrors.order_id = "You must select an order.";
            isValid = false;
        } else {
            setData("order_id", selectedOrderId?.toString() || ""); // Set the order_id
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            put(`/feedbacks/${feedbacks.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Edit Feedback
                </h2>
            }
        >
            <Head title="Edit Feedback" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            href="/feedbacks"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            &larr; Back to Feedback List
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
                                {/* Dropdown to select order */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select Order:
                                    </label>
                                    <select
                                        value={selectedOrderId || ""}
                                        onChange={(e) => {
                                            const selectedOrderId = parseInt(
                                                e.target.value
                                            );
                                            const selectedOrder = orders.find(
                                                (order) =>
                                                    order.id === selectedOrderId
                                            );
                                            if (selectedOrder) {
                                                setSelectedOrderId(
                                                    selectedOrderId
                                                ); // Set the selected order ID for display
                                                setData(
                                                    "product_id",
                                                    selectedOrder.product_id
                                                ); // Set the correct product_id
                                                setData(
                                                    "order_id",
                                                    selectedOrderId.toString()
                                                ); // Set the order_id to the selected order
                                            }
                                        }}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">
                                            -- Select an Order --
                                        </option>
                                        {orders.length > 0 ? (
                                            orders.map((order) => (
                                                <option
                                                    key={order.id}
                                                    value={order.id}
                                                >
                                                    Order #{order.id} - RM{" "}
                                                    {Number(
                                                        order.total_amount
                                                    ).toFixed(2)}{" "}
                                                    (Placed on{" "}
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString()}
                                                    )
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>
                                                No orders available
                                            </option>
                                        )}
                                    </select>

                                    {formErrors.order_id && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {formErrors.order_id}
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Message:
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.message && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {formErrors.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Update Feedback
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
