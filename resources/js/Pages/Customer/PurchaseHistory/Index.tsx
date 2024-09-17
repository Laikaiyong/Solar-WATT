import { Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

interface PurchasedItem {
    id: number;
    solar_product: {
        name: string; // Assuming you have a 'name' field in your 'solar_products_services' table
    };
    quantity: number;
    price: number;
    order_date: string; // This will be passed if needed for context
}

export default function Index({
    auth,
    purchasedItems,
}: {
    auth: any;
    purchasedItems: PurchasedItem[];
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Purchase History
                </h2>
            }
        >
            <Head title="Purchase History" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Table to display the purchased items */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Order Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {purchasedItems.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {
                                                            item.solar_product
                                                                .name
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {item.quantity}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        ${item.price.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {new Date(
                                                            item.order_date
                                                        ).toLocaleDateString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {purchasedItems.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No purchases available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
