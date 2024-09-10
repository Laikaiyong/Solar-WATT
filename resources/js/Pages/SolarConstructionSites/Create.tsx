import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Create({ auth }: { auth: any }) {
    const { data, setData, post, errors } = useForm({
        name: '',
        location: '',
        contact_number: '',
        email: '',
        capacity: '',
        manager_name: '',
        status: 'Active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/solar-construction-sites');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create Solar Panel Construction Site</h2>}
        >
            <Head title="Create Solar Construction Site" />

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
                                    {errors.name && <div className="text-red-600 text-sm mt-2">{errors.name}</div>}
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
                                    {errors.location && <div className="text-red-600 text-sm mt-2">{errors.location}</div>}
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
                                    {errors.contact_number && <div className="text-red-600 text-sm mt-2">{errors.contact_number}</div>}
                                </div>

                                {/* Email */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email:</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
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
                                    {errors.capacity && <div className="text-red-600 text-sm mt-2">{errors.capacity}</div>}
                                </div>

                                {/* Manager Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Name:</label>
                                    <input
                                        type="text"
                                        value={data.manager_name}
                                        onChange={e => setData('manager_name', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {errors.manager_name && <div className="text-red-600 text-sm mt-2">{errors.manager_name}</div>}
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Under Construction">Under Construction</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    {errors.status && <div className="text-red-600 text-sm mt-2">{errors.status}</div>}
                                </div>

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Create Site
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
