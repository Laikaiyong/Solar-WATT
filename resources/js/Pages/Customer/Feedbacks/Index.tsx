import { Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Feedback {
    id: number;
    message: string;
    product_id: number;
    user: {
        id: number;
        name: string;
    };
}

interface Order {
    id: number;
    created_at: string;
    total_amount: number;
}

export default function Index({
    auth,
    feedbacks,
}: {
    auth: any;
    feedbacks: Feedback[];
}) {
    // Create a form to handle deletions
    const { delete: destroy, errors } = useForm();

    // Handle delete request
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this feedback?")) {
            destroy(`/feedbacks/${id}`, {
                method: "delete", // Use lowercase 'delete'
            });
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
                    Customer Feedback
                </h2>
            }
        >
            <Head title="Customer Feedback" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <Link
                            href="/feedbacks/create"
                            className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Add New Feedback
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Table to display the feedbacks */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Message
                                            </th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {feedbacks.map((feedback) => (
                                            <tr key={feedback.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {"Order " + orders.find(order => order.id == feedback.product_id)?.id + " RM " + orders.find(order => order.id == feedback.product_id)?.total_amount}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {feedback.message}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/feedbacks/${feedback.id}/edit`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    feedback.id
                                                                )
                                                            }
                                                            className="text-red-600 dark:text-red-400 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {feedbacks.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No feedback available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
