import { Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

interface Order {
    id: number;
    status: string;
    order_date: string;
    user: {
        id: number;
        name: string;
    };
}

export default function Index({
    auth,
    orders,
}: {
    auth: any;
    orders: Order[];
}) {
    // Create a form to handle deletions
    const { delete: destroy, errors } = useForm();

    // Create a form to handle purchases
    const { post: purchase } = useForm();

    // Handle delete request
    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this order?")) {
            destroy(`/orders/${id}`, {
                method: "delete", // Use lowercase 'delete'
            });
        }
    };

    // Handle purchase request
    const handlePurchase = (id: number) => {
        if (confirm("Are you sure you want to purchase this order?")) {
            purchase(`/orders/${id}/purchase`, {
                method: "post",
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Customer Orders
                </h2>
            }
        >
            <Head title="Customer Orders" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-4">
                        <Link
                            href="/orders/create"
                            className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Create New Order
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Table to display the orders */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Order Date
                                            </th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {order.user.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {order.status}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {new Date(
                                                            order.order_date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/orders/${order.id}/edit`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            View
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    order.id
                                                                )
                                                            }
                                                            className="text-red-600 dark:text-red-400 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handlePurchase(
                                                                    order.id
                                                                )
                                                            }
                                                            className="text-green-600 dark:text-green-400 hover:underline"
                                                        >
                                                            Purchase
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {orders.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No orders available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
