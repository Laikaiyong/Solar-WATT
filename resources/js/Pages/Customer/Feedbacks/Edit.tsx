import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Feedback {
    id: number;
    product_id: number;
    message: string;
}

interface EditProps {
    auth: any;
    feedbacks: Feedback;
}

interface Order {
    id: number;
    created_at: string;
    total_amount: number;
}

export default function Edit({ auth, feedbacks }: EditProps) {
    const [localErrors, setLocalErrors] = useState<any>({});

    const { data, setData, put } = useForm({
        message: feedbacks.message
    });

    const validate = () => {
        const newErrors: any = {};
        if (!data.message) newErrors.message = "Message is required.";

        setLocalErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            put(`/feedbacks/${feedbacks.id}`);
        }
    };

    const [orders, setOrders] = useState<Order[]>([]); // Initialize as an empty array

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
                                {/* Message */}
                                <div className="mb-4">
                                    <p className="text-gray-700 dark:text-gray-300">
                                        Order ID: {orders.find(order => order.id === feedbacks.product_id)?.id} | 
                                        Total Amount: {orders.find(order => order.id === feedbacks.product_id)?.total_amount}
                                    </p>
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
                                    {localErrors.message && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.message}
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
