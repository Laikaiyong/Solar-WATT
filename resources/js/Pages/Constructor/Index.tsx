import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface QuotationListProps {
    quotations: {
        id: number;
        project_name: string;
        description: string;
        price: number;
        duration: number;
        status: string;
        hasProject: boolean;
    }[];
    auth: any;
}

export default function QuotationList({ quotations, auth }: QuotationListProps) {
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this quotation?')) {
            destroy(`/quotations/${id}`, {
                method: 'delete',
            });
        }
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-800 border border-green-300 rounded-full px-2 py-1 text-xs'; // Smaller size
            case 'Rejected':
                return 'bg-red-100 text-red-800 border border-red-300 rounded-full px-2 py-1 text-xs'; // Smaller size
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full px-2 py-1 text-xs'; // Smaller size
            default:
                return '';
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Quotations</h2>}
        >
            <Head title="Quotation List" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            {quotations.length === 0 ? (
                                <div className="text-center text-gray-500 mt-6">
                                    No quotations available.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price $</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Duration (Months)</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {quotations.map((quotation) => (
                                            <tr key={quotation.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{quotation.project_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{quotation.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${Number(quotation.price).toFixed(2)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{quotation.duration}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(quotation.status)}`}>
                                                            {quotation.status}
                                                        </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                    {quotation.status === 'Accepted' && !quotation.hasProject ? (
                                                        <Link
                                                            href={`/constructor-projects/create?quotation_id=${quotation.id}`} 
                                                            className="text-green-600 dark:text-green-400 hover:underline"
                                                        >
                                                            Create Project
                                                        </Link>
                                                    ) : quotation.status === 'Accepted' && quotation.hasProject ? (
                                                        <button
                                                            className="text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                            disabled
                                                        >
                                                            Create Project
                                                        </button>
                                                    ) : quotation.status === 'Rejected' ? (
                                                        <>
                                                            <button
                                                                className="text-gray-400 dark:text-gray-600 cursor-not-allowed mr-4"
                                                                disabled
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                                                disabled
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Link 
                                                                href={`/quotations/${quotation.id}/edit`} 
                                                                className="text-blue-600 dark:text-blue-400 hover:underline mr-4"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(quotation.id)}
                                                                className="text-red-600 dark:text-red-400 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            )}

                            <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
