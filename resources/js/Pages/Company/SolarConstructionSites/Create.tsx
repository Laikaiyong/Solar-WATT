import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export default function Create({ auth }: { auth: any }) {
    const [formErrors, setFormErrors] = useState<any>({});

    const { data, setData, post, errors } = useForm({
        name: '',
        location: '',
        contact_number: '',
        email: auth.user.email,
        capacity: '',
        manager_name: auth.user.name,
        status: 'Pending',  
    });

    useEffect(() => {
        const toastMessage = localStorage.getItem('toastMessage');
        if (toastMessage) {
            toast.success(toastMessage);  // Show toast
            localStorage.removeItem('toastMessage'); 
        }
    }, []);

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.name) {
            newErrors.name = 'Site name is required.';
            isValid = false;
        }
        if (!data.location) {
            newErrors.location = 'Location is required.';
            isValid = false;
        }
        if (!data.contact_number) {
            newErrors.contact_number = 'Contact number is required.';
            isValid = false;
        } else if (!/^\d+$/.test(data.contact_number)) {
            newErrors.contact_number = 'Contact number must contain only digits.';
            isValid = false;
        }
        if (!data.capacity || parseFloat(data.capacity) <= 0) {
            newErrors.capacity = !data.capacity ? 'Capacity is required.' : 'Capacity must be greater than 0.';
            isValid = false;
        } else if (!/^\d+$/.test(data.capacity)) {
            newErrors.capacity = 'Capacity must contain only digits.';
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            post('/solar-construction-sites', {
                onSuccess: () => {
                    localStorage.setItem('toastMessage', 'Site plan created successfully!');
                    setTimeout(() => {
                        window.location.href = '/solar-construction-sites';
                    }, 1000);  // 1s delay
                    },
                onError: () => {
                    toast.error('Failed to create site plan. Please check the form.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Solar Panel Construction Site Plan</h2>}
        >
            <Head title="Create Solar Site Plan" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            href="/solar-construction-sites"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            &larr; Back to Site List
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <p className="mb-4">
                                You are creating a <strong>site plan</strong>. Constructor will review this plan and proceed with quotation.
                            </p>

                            <form onSubmit={submit}>
                                {/* Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Site Name:</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.name && <div className="text-red-600 text-sm mt-2">{formErrors.name}</div>}
                                </div>

                                {/* Location */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location:</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={e => setData('location', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.location && <div className="text-red-600 text-sm mt-2">{formErrors.location}</div>}
                                </div>

                                {/* Contact Number */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number:</label>
                                    <input
                                        type="text"
                                        value={data.contact_number}
                                        onChange={e => setData('contact_number', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.contact_number && <div className="text-red-600 text-sm mt-2">{formErrors.contact_number}</div>}
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.email && <div className="text-red-600 text-sm mt-2">{errors.email}</div>}
                                </div>

                                {/* Capacity */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity (MW):</label>
                                    <input
                                        type="number"
                                        value={data.capacity}
                                        onChange={e => setData('capacity', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.capacity && <div className="text-red-600 text-sm mt-2">{formErrors.capacity}</div>}
                                </div>

                                {/* Manager Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Name:</label>
                                    <input
                                        type="text"
                                        value={data.manager_name}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.manager_name && <div className="text-red-600 text-sm mt-2">{errors.manager_name}</div>}
                                </div>

                                {/* Status (Hidden Field) */}
                                <input type="hidden" value={data.status} />

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Create Site Plan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Container to display notifications */}
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
