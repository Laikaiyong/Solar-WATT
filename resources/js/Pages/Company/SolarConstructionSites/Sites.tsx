import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface AuthUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    role: string;  
    created_at?: string;  
    updated_at?: string;  
}

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

interface Quotation {
    solar_site_id: number;
    constructor_id: number;
    status: string; // Adding status to the Quotation interface
}

export default function Sites({ auth, sites, quotations }: { auth: AuthUser, sites: Site[], quotations: Quotation[] }) {

    // Function to get the user's quotation for a specific site, if any
    const getUserQuotation = (siteId: number) => {
        if (!auth || !auth.id) {
            console.error('auth.user is not defined');
            return null;
        }

        return quotations.find(quotation => 
            quotation.solar_site_id === siteId && quotation.constructor_id === auth.id
        );
    };

    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Available Sites</h2>}
        >
            <Head title="Solar Construction Sites" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Manager Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Contact Number</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Capacity (MW)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200">
                                        {sites.map(site => {
                                            const userQuotation = getUserQuotation(site.id);

                                            return (
                                                <tr key={site.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{site.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-300">{site.location}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-300 text-center">{site.manager_name || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-300 text-center">{site.contact_number || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-300 text-center">{site.email || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500 dark:text-gray-300 text-center">{site.capacity ? `${site.capacity} MW` : 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${site.status === 'Operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                            {site.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {site.status === 'Pending' ? (
                                                            userQuotation ? (
                                                                userQuotation.status === 'Rejected' ? (
                                                                    <span className="text-sm text-red-500 dark:text-red-300">
                                                                        Your quotation for this site was rejected.
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-sm text-gray-500 dark:text-gray-300">
                                                                        You have created the quotation for this site
                                                                    </span>
                                                                )
                                                            ) : (
                                                                <Link
                                                                    href={`/quotations/create?solar_site_id=${site.id}`}
                                                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                                                >
                                                                    Create Quotation
                                                                </Link>
                                                            )
                                                        ) : (
                                                            <span className="text-sm text-gray-500 dark:text-gray-300">
                                                                This site is {site.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {sites.length === 0 && (
                                <div className="mt-6 text-center text-gray-500 dark:text-gray-300">
                                    No construction sites available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
