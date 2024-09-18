import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Quotation {
    id: number;
    project_name: string;
    description: string;
    price: number;
    duration: number;
}

export default function EditQuotation({ auth, quotation }: { auth: any, quotation: Quotation }) {
    const { data, setData, put, errors } = useForm({
        project_name: quotation.project_name,
        description: quotation.description,
        price: quotation.price,
        duration: quotation.duration,
    });

    const [formErrors, setFormErrors] = useState<any>({});

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};
    
        // Price validation
        if (data.price === undefined || data.price === null || data.price <= 0) {
            newErrors.price = data.price === undefined || data.price === null
                ? 'Price is required.'
                : 'Price must be greater than 0.'; // Prevent 0 or negative
            isValid = false;
        }
    
        // Duration validation
        if (data.duration === undefined || data.duration === null || data.duration <= 0) {
            newErrors.duration = data.duration === undefined || data.duration === null
                ? 'Duration is required.'
                : 'Duration must be greater than 0.'; // Prevent 0 or negative
            isValid = false;
        }
    
        setFormErrors(newErrors);
        return isValid;
    };
    

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            put(`/quotations/${quotation.id}`, {
                onSuccess: () => {
                    window.location.href = '/quotations';
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Quotation</h2>}
        >
            <Head title="Edit Quotation" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {/* Back Button */}
                            <div className="mb-4">
                                <Link
                                    href="/quotations"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    &larr; Back to Quotation List
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                {/* Project Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name:</label>
                                    <input
                                        type="text"
                                        value={data.project_name}
                                        onChange={e => setData('project_name', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.project_name && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.project_name}</div>}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.description && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.description}</div>}
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price:</label>
                                    <input
                                        type="number"
                                        value={data.price}
                                        onChange={e => setData('price', parseFloat(e.target.value))}
                                        min="0" // Prevent negative values in input
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {formErrors.price && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.price}</div>}
                                </div>

                                {/* Duration */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Duration (months):</label>
                                    <input
                                        type="number"
                                        value={data.duration}
                                        onChange={e => setData('duration', parseFloat(e.target.value))}
                                        min="0" // Prevent negative values in input
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        required
                                    />
                                    {formErrors.duration && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.duration}</div>}
                                </div>

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Update Quotation
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
