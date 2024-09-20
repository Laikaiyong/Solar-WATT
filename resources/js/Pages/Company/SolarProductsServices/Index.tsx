import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const bucketLink = import.meta.env.VITE_S3_BUCKET_LINK || '';

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
    image_path?: string;
}

export default function Index({ auth, products }: { auth: any, products: Product[] }) {
    const { delete: destroy } = useForm();
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [filterType, setFilterType] = useState<'All' | 'Product' | 'Service'>('All');
    const [filterName, setFilterName] = useState('');
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

    // Handle delete request
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product/service?')) {
            destroy(`/solar-products-services/${id}`, {
                method: 'delete',
                onSuccess: () => {
                    localStorage.setItem('toastMessage', 'Product/Service deleted successfully!');
                    window.location.reload();
                },
                onError: () => {
                    toast.error('Failed to delete the product/service.');
                },
            });
        }
    };

    useEffect(() => {
        const toastMessage = localStorage.getItem('toastMessage');
        if (toastMessage) {
            toast.success(toastMessage); 
            localStorage.removeItem('toastMessage'); 
        }
    }, []);

    useEffect(() => {
        let filtered = products;

        if (filterName) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        if (filterType !== 'All') {
            filtered = filtered.filter(product => product.type === filterType);
        }

        if (sortOrder === 'asc') {
            filtered = filtered.sort((a, b) => (a.price && b.price ? parseFloat(a.price) - parseFloat(b.price) : 0));
        } else if (sortOrder === 'desc') {
            filtered = filtered.sort((a, b) => (a.price && b.price ? parseFloat(b.price) - parseFloat(a.price) : 0));
        }

        setFilteredProducts(filtered);
    }, [filterType, filterName, sortOrder, products]);

    const handleSortPrice = () => {
        if (sortOrder === 'default') {
            setSortOrder('asc');
        } else if (sortOrder === 'asc') {
            setSortOrder('desc');
        } else {
            setSortOrder('default');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Solar Products & Services</h2>}
        >
            <Head title="Solar Products & Services" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between mb-4">
                        {/* Filter Dropdown */}
                        <div>
                            <label className="text-gray-700 dark:text-gray-300 mr-2">Filter by Type:</label>
                            <select
                                value={filterType}
                                onChange={e => setFilterType(e.target.value as 'All' | 'Product' | 'Service')}
                                className="bg-gray-200 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg p-2 w-36" 
                            >
                                <option value="All">All</option>
                                <option value="Product">Products</option>
                                <option value="Service">Services</option>
                            </select>
                        </div>

                        {/* Create New Product Button */}
                        <Link
                            href="/solar-products-services/create"
                            className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Create New Product
                        </Link>
                    </div>

                    {/* Filter by Name */}
                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300 mr-2">Search by Name:</label>
                        <input
                            type="text"
                            value={filterName}
                            onChange={e => setFilterName(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg p-2"
                            placeholder="Type product or service name"
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                onClick={handleSortPrice}
                                            >
                                                Price
                                                {sortOrder === 'asc' ? ' ↑' : sortOrder === 'desc' ? ' ↓' : ''}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Availability</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Image</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {filteredProducts.map(product => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{product.description || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{product.type}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">
                                                        {product.price ? `RM${parseFloat(product.price).toFixed(2)}` : 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{product.availability}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{product.solar_site?.name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {product.image_path && (
                                                        <img
                                                            src={bucketLink + product.image_path}
                                                            alt={product.name}
                                                            className="w-20 h-20 object-cover"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/solar-products-services/${product.id}/edit`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
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

                            {filteredProducts.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No products or services available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
