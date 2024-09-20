import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const bucketLink = import.meta.env.VITE_S3_BUCKET_LINK || "";

interface Product {
    id: number;
    name: string;
    description: string;
    type: string;
    price: string;
    availability: string;
    solar_site_id: number;
    image_path?: string; 
}

interface SolarSite {
    id: number;
    name: string;
}

interface EditProps {
    auth: any;
    product: Product;
    solarSites: SolarSite[];
}

export default function Edit({ auth, product, solarSites }: EditProps) {
    const [localErrors, setLocalErrors] = useState<any>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, patch, errors } = useForm({
        name: product.name,
        description: product.description,
        type: product.type,
        price: parseFloat(product.price), 
        availability: product.availability,
        solar_site_id: product.solar_site_id,
        image: null as string | null, 
    });

    const [previewImage, setPreviewImage] = useState<string | null>(
        bucketLink + product.image_path || null
    ); // Image preview

    const validate = () => {
        const newErrors: any = {};
        if (!data.name) newErrors.name = "Name is required.";
        if (!data.description)
            newErrors.description = "Description is required.";
        if (!data.type) newErrors.type = "Type is required.";
        if (!data.price || data.price <= 10)
            newErrors.price = "Price must be greater than 10.";
        if (!data.availability)
            newErrors.availability = "Availability is required.";
        if (!data.solar_site_id)
            newErrors.solar_site_id = "Solar Site is required.";

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreviewImage(result);
                setData('image', result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            patch(`/solar-products-services/${product.id}`, {
                onSuccess: () => {
                    localStorage.setItem('toastMessage', 'Product/Service updated successfully!');
                    setTimeout(() => {
                        window.location.href = '/solar-products-services';
                    }, 1000);  // 1s delay
                },
                onError: () => {
                    toast.error('Failed to update the product/service.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Edit Solar Product or Service
                </h2>
            }
        >
            <Head title="Edit Solar Product or Service" />

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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {localErrors.name && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.name}
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description:
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {localErrors.description && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.description}
                                        </div>
                                    )}
                                </div>

                                {/* Type */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Type:
                                    </label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData("type", e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="Product">Product</option>
                                        <option value="Service">Service</option>
                                    </select>
                                    {localErrors.type && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.type}
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Price:
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData("price", e.target.valueAsNumber)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {localErrors.price && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.price}
                                        </div>
                                    )}
                                </div>

                                {/* Availability */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Availability:
                                    </label>
                                    <select
                                        value={data.availability}
                                        onChange={(e) => setData("availability", e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="In Stock">In Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </select>
                                    {localErrors.availability && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.availability}
                                        </div>
                                    )}
                                </div>

                                {/* Solar Site */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Solar Site:
                                    </label>
                                    <select
                                        value={data.solar_site_id}
                                        onChange={(e) => setData("solar_site_id", parseInt(e.target.value))}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select a Solar Site</option>
                                        {solarSites.map((site) => (
                                            <option key={site.id} value={site.id}>
                                                {site.name}
                                            </option>
                                        ))}
                                    </select>
                                    {localErrors.solar_site_id && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.solar_site_id}
                                        </div>
                                    )}
                                </div>

                                {/* Image Upload */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Upload New Image:
                                    </label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {previewImage && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600">
                                                Current Image:
                                            </p>
                                            <img
                                                src={previewImage}
                                                alt="Current image"
                                                className="w-32 h-32 object-cover"
                                            />
                                        </div>
                                    )}
                                    {localErrors.image && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {localErrors.image}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Update Product/Service
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Container for Notifications */}
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
