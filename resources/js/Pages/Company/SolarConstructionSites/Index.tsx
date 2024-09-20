import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Site {
    id: number;
    name: string;
    location: string;
    contact_number?: string;
    email?: string;
    capacity?: number;
    manager_name?: string;
    status: string;
}

export default function Index({ auth, sites }: { auth: any, sites: Site[] }) {
    const { delete: destroy } = useForm();
    const [filteredSites, setFilteredSites] = useState(sites);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Under Construction' | 'Inactive' | 'Active' >('All');
    const [filterName, setFilterName] = useState('');
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

    // Handle delete request
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this site?')) {
            destroy(`/solar-construction-sites/${id}`, {
                method: 'delete',
                onSuccess: () => {
                    localStorage.setItem('toastMessage', 'Site deleted successfully!');
                    window.location.reload();
                },
                onError: () => {
                    toast.error('Failed to delete the site.');
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
        let filtered = sites;

        // Search by name
        if (filterName) {
            filtered = filtered.filter(site =>
                site.name.toLowerCase().includes(filterName.toLowerCase())
            );
        }

        // Filter by status
        if (filterStatus !== 'All') {
            filtered = filtered.filter(site => site.status === filterStatus);
        }

        // Sort by capacity
        if (sortOrder === 'asc') {
            filtered = filtered.sort((a, b) => (a.capacity && b.capacity ? a.capacity - b.capacity : 0));
        } else if (sortOrder === 'desc') {
            filtered = filtered.sort((a, b) => (a.capacity && b.capacity ? b.capacity - a.capacity : 0));
        }

        setFilteredSites(filtered);
    }, [filterStatus, filterName, sortOrder, sites]);

    const handleSortCapacity = () => {
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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Solar Panel Construction Sites</h2>}
        >
            <Head title="Solar Construction Sites" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between mb-4">
                        {/* Filter Dropdown */}
                        <div>
                            <label className="text-gray-700 dark:text-gray-300 mr-2">Filter by Type:</label>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value as 'All' | 'Pending' | 'Under Construction' | 'Inactive' | 'Active')}
                                className="bg-gray-200 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg p-2 w-48"
                            >
                                <option value="All">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Under Construction">Under Construction</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Active">Active</option>
                            </select>
                        </div>


                        {/* Create New Site Button */}
                        <Link
                            href="/solar-construction-sites/create"
                            className="btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                        >
                            + Create New Site Plan
                        </Link>
                    </div>

                     {/* Filter by Name */}
                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300 mr-2">Search by Name:</label>
                        <input
                            type="text"
                            placeholder="Search by site name"
                            value={filterName}
                            onChange={e => setFilterName(e.target.value)}
                            className="bg-gray-200 dark:bg-gray-900 border border-gray-400 dark:border-gray-700 rounded-lg p-2"
                        />
                    </div>       

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                                            <th
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                                                onClick={handleSortCapacity}
                                            >
                                                Capacity (MW)
                                                {sortOrder === 'asc' ? ' ↑' : sortOrder === 'desc' ? ' ↓' : ''}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {filteredSites.map(site => (
                                            <tr key={site.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{site.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{site.location}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{site.contact_number || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{site.email || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{site.capacity ? `${site.capacity} MW` : 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-300">{site.manager_name || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${site.status === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {site.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link
                                                            href={`/solar-construction-sites/${site.id}/edit`}
                                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(site.id)}
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

                            {filteredSites.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No construction sites available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Container to display notifications */}
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
