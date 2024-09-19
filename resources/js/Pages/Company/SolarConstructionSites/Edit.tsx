import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Site {
    id: number;
    name: string;
    location: string;
    contact_number: string;
    email: string;
    capacity: string;
    manager_name: string;
    status: string;
}

export default function Edit({ auth, site }: { auth: any, site: Site }) {
    const { data, setData, put, errors } = useForm({
        name: site.name,
        location: site.location,
        contact_number: site.contact_number,
        email: site.email,
        capacity: site.capacity,
        manager_name: site.manager_name,
        status: site.status,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/solar-construction-sites/${site.id}`);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Solar Panel Construction Site</h2>}
        >
            <Head title="Edit Solar Construction Site" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {/* Back Button */}
                            <div className="mb-4">
                                <Link
                                    href="/solar-construction-sites"
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    &larr; Back to Site List
                                </Link>
                            </div>

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
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Under Construction">Under Construction</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    {errors.status && <div className="text-red-600 text-sm mt-2">{errors.status}</div>}
                                </div>

                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                                    Update Site
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
