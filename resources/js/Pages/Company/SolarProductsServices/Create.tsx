import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ auth, solarSites }: { auth: any, solarSites: { id: number, name: string }[] }) {
    const { data, setData, post, progress } = useForm({
        name: '',
        description: '',
        type: 'Product', // Default type
        price: '',
        availability: 'In Stock', // Default availability
        solar_site_id: '', // Default to empty
        image: null as File | null,  
    });

    const [formErrors, setFormErrors] = useState<any>({});

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.name) {
            newErrors.name = 'Name is required.';
            isValid = false;
        }
        if (!data.description) {
            newErrors.description = 'Description is required.';
            isValid = false;
        }
        if (!data.price || parseFloat(data.price) <= 10) {
            newErrors.price = !data.price ? 'Price is required.' : 'Price must be greater than 10.';
            isValid = false;
        }
        if (!data.solar_site_id) {
            newErrors.solar_site_id = 'Solar Site selection is required.';
            isValid = false;
        }
        if (!data.image) {
            newErrors.image = 'Image upload is required.';
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            post('/solar-products-services');
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Solar Product or Service</h2>}
        >
            <Head title="Create Solar Product or Service" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            href="/solar-products-services"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            &larr; Back to Products & Services List
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <form onSubmit={submit}>
                                {/* Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name:</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.name && <div className="text-red-600 text-sm mt-2">{formErrors.name}</div>}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.description && <div className="text-red-600 text-sm mt-2">{formErrors.description}</div>}
                                </div>

                                {/* Type */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
                                    <select
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="Product">Product</option>
                                        <option value="Service">Service</option>
                                    </select>
                                    {formErrors.type && <div className="text-red-600 text-sm mt-2">{formErrors.type}</div>}
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.price && <div className="text-red-600 text-sm mt-2">{formErrors.price}</div>}
                                </div>

                                {/* Availability */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Availability:</label>
                                    <select
                                        value={data.availability}
                                        onChange={e => setData('availability', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                    {formErrors.availability && <div className="text-red-600 text-sm mt-2">{formErrors.availability}</div>}
                                </div>

                                {/* Solar Site */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solar Site:</label>
                                    <select
                                        value={data.solar_site_id}
                                        onChange={e => setData('solar_site_id', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select a Solar Site</option>
                                        {solarSites.map(site => (
                                            <option key={site.id} value={site.id}>{site.name}</option>
                                        ))}
                                    </select>
                                    {formErrors.solar_site_id && <div className="text-red-600 text-sm mt-2">{formErrors.solar_site_id}</div>}
                                </div>

                                {/* Image Upload */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image:</label>
                                    <input
                                        accept="image/*"
                                        type="file"
                                        onChange={e => setData('image', e.target.files ? e.target.files[0] : null)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.image && <div className="text-red-600 text-sm mt-2">{formErrors.image}</div>}
                                </div>

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Create Product/Service
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}