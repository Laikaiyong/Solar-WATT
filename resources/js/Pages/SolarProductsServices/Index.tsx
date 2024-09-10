import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Product {
    id: number;
    name: string;
    description?: string;
    type: 'Product' | 'Service';
    price?: string; 
    availability: string;
    solar_site: {
        id: number;
        name: string;
    } | null; 
}

export default function Index({ auth, products }: { auth: any, products: Product[] }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Solar Products & Services</h2>}
        >
            <Head title="Solar Products & Services" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-end mb-4">
                        <Link 
                            href="/solar-products-services/create" 
                            className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Create New Product
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Table to display the products and services */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Availability
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Site Name
                                            </th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {product.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {product.description || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {product.type}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {product.price ? `RM${parseFloat(product.price).toFixed(2)}` : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {product.availability}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {product.solar_site?.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link 
                                                        href={`/solar-products-services/${product.id}/edit`} 
                                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {products.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No products or services available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
