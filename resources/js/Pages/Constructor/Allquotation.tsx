import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify'; // Make sure to import ToastContainer
import { useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

interface QuotationListProps {
    quotations: {
        id: number;
        project_name: string;
        description: string;
        price: number;
        duration: number;
        status: string;
        constructor: {
            id: number;
            name: string;
        };
        solar_site_id: number;
    }[];
    auth: any;
}

export default function AllQuotation({ quotations, auth }: QuotationListProps) {
    const { post } = useForm();

    // UseEffect to show toast messages stored in localStorage after page reloads
    useEffect(() => {
        const toastMessage = localStorage.getItem('toastMessage');
        if (toastMessage) {
            toast.success(toastMessage);  // Show toast
            localStorage.removeItem('toastMessage');  // Clear the message from localStorage
        }
    }, []);  // Empty dependency array means it runs once on component mount

    const handleApprove = async (id: number, solarSiteId: number) => {
        try {
            // Approve the quotation
            const approveResponse = await axios.post(`/quotations/${id}/approve`);
            console.log('Quotation approved:', approveResponse.data);
    
            // Update the solar site status to "Under Construction"
            const updateStatusResponse = await axios.post(`/solar-construction-sites/${solarSiteId}/update-status`, {
                status: 'Under Construction',
            });
            console.log('Site status updated to "Under Construction":', updateStatusResponse.data);
    
            // Store a message in localStorage before refreshing the page
            localStorage.setItem('toastMessage', 'Quotation approved. The site status has been updated to "Under Construction".');
    
            // Refresh the page immediately
            window.location.reload();
        } catch (error: any) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                toast.error(error.response.data.message || 'Failed to process the request.');
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('No response received from server.');
            } else {
                console.error('Error:', error.message);
                toast.error(error.message);
            }
        }
    };
       
    
    const handleReject = async (id: number) => {
        try {
            if (window.confirm('Are you sure you want to reject this quotation?')) {
                // Make an axios post request to reject the quotation
                const rejectResponse = await axios.post(`/quotations/${id}/reject`);
                console.log('Quotation rejected:', rejectResponse.data);
    
                // Store a message in localStorage before refreshing the page
                localStorage.setItem('toastMessage', 'Quotation rejected. No further action will be taken on this proposal.');
    
                // Refresh the page immediately
                window.location.reload();
            }
        } catch (error: any) {
            console.error('Failed to reject the quotation:', error.response ? error.response.data : error.message);
            toast.error('Failed to reject the quotation.');
        }
    };
    
    // Sort quotations by project name
    const sortedQuotations = quotations.slice().sort((a, b) => {
        return a.project_name.localeCompare(b.project_name);
    });

    // Function to get status classes based on the status value
    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'Accepted':
                return 'bg-green-100 text-green-800 border border-green-300 rounded-full px-2 py-1 text-xs';
            case 'Rejected':
                return 'bg-red-100 text-red-800 border border-red-300 rounded-full px-2 py-1 text-xs';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-full px-2 py-1 text-xs';
            default:
                return '';
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">All Quotations</h2>}
        >
            <Head title="All Quotations" />

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
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price (RM)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Duration (Months)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Constructor Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {sortedQuotations.map((quotation) => (
                                                <tr key={quotation.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{quotation.project_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{quotation.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">RM{Number(quotation.price).toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{quotation.duration}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{quotation.constructor.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(quotation.status)}`}>
                                                            {quotation.status}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                                        {quotation.status === 'Pending' ? (
                                                            <>
                                                                <button
                                                                    onClick={() => handleApprove(quotation.id, quotation.solar_site_id)}
                                                                    className="text-green-600 dark:text-green-400 hover:underline mr-4"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleReject(quotation.id)}
                                                                    className="text-red-600 dark:text-red-400 hover:underline"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span>
                                                                {quotation.status === 'Accepted' ? (
                                                                    <span className="text-green-600">This quotation has been accepted.</span>
                                                                ) : (
                                                                    <span className="text-red-600">This quotation has been rejected.</span>
                                                                )}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}         
                        </div>
                    </div>
                </div>
            </div>

            {/* Add the ToastContainer inside the layout */}
            <ToastContainer />
        </AuthenticatedLayout>
    );
}
