import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Description } from '@radix-ui/react-toast';
import axios from 'axios';

interface Project {
    id: number;
    project_name: string;
    description: string;
    start_date: string;
    expected_end_date: string;
    status: string;
    constructor_in_charge: string;
    manager_name: string;
    manager_contact_number: string;
    quotation_id: number;
}

export default function EditProject({ auth, project }: { auth: any, project: Project }) {
    const { data, setData, put, errors, processing } = useForm({
        project_name: project.project_name,
        description: project.description,
        start_date: project.start_date,
        expected_end_date: project.expected_end_date,
        status: project.status,
        constructor_in_charge: project.constructor_in_charge,
        manager_name: project.manager_name,
        manager_contact_number: project.manager_contact_number,
    });

    const [formErrors, setFormErrors] = useState<any>({});

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.expected_end_date);
    const minEndDate = new Date(startDate);
    minEndDate.setMonth(startDate.getMonth() + 1);

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.project_name) {
            newErrors.project_name = 'Project Name is required.';
            isValid = false;
        }
        if (!data.start_date) {
            newErrors.start_date = 'Start Date is required.';
            isValid = false;
        } else if (startDate < tomorrow) {
            newErrors.start_date = 'Start Date must be tomorrow or later.';
            isValid = false;
        }
        if (!data.expected_end_date) {
            newErrors.expected_end_date = 'Expected End Date is required.';
            isValid = false;
        } else if (endDate < minEndDate) {
            newErrors.expected_end_date = 'Expected End Date must be at least 1 month after the Start Date.';
            isValid = false;
        }
        if (!data.status) {
            newErrors.status = 'Status is required.';
            isValid = false;
        }
        if (!data.constructor_in_charge) {
            newErrors.constructor_in_charge = 'Constructor in Charge is required.';
            isValid = false;
        }
        if (!data.manager_name) {
            newErrors.manager_name = 'Manager Name is required.';
            isValid = false;
        }
        const contactNumberPattern = /^[0-9]+$/;
        if (!data.manager_contact_number) {
            newErrors.manager_contact_number = 'Manager Contact is required.';
            isValid = false;
        } else if (!contactNumberPattern.test(data.manager_contact_number)) {
            newErrors.manager_contact_number = 'Manager Contact must be a valid number.';
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (validate()) {
            const updatedData = { ...data, manager_contact_number: String(data.manager_contact_number) };
    
            await put(`/constructor-projects/${project.id}`, {
                data: updatedData,
                onSuccess: async () => {
                    if (data.status === 'completed') {
                        try {
                            const { data: quotation } = await axios.get(`/quotations/${project.quotation_id}`);
                            const solarSiteId = quotation.solar_site_id;
                            console.log('Updating site status to Inactive for site:', solarSiteId);
                    
                            // Ensure the axios.put URL and parameters are correct
                            await axios.put(`/solar-construction-sites/${solarSiteId}/update-status`, { status: 'Inactive' });
                    
                            window.location.href = '/constructor-projects';
                        } catch (err) {
                            console.error('Error updating site status:', err);
                        }
                    } else {
                        window.location.href = '/constructor-projects'; // Redirect if the project is not completed
                    }
                },
            });
        }
    };         

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Project</h2>}
        >
            <Head title="Edit Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-4">
                                <Link
                                    href={route('constructor-projects.index')}
                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    &larr; Back to Project List
                                </Link>
                            </div>

                            <form onSubmit={submit}>
                                {/* Project Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Name:</label>
                                    <input
                                        type="text"
                                        value={data.project_name}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 dark:text-gray-400"
                                    />
                                    {formErrors.project_name && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.project_name}</div>}
                                </div>

                                {/* Start Date */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date:</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.start_date && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.start_date}</div>}
                                </div>

                                {/* Expected End Date */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected End Date:</label>
                                    <input
                                        type="date"
                                        value={data.expected_end_date}
                                        onChange={e => setData('expected_end_date', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.expected_end_date && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.expected_end_date}</div>}
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    {formErrors.status && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.status}</div>}
                                </div>

                                {/* Constructor in Charge */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Constructor in Charge:</label>
                                    <input
                                        type="text"
                                        value={data.constructor_in_charge}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 dark:text-gray-400"
                                    />
                                    {formErrors.constructor_in_charge && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.constructor_in_charge}</div>}
                                </div>

                                {/* Manager Name */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Name:</label>
                                    <input
                                        type="text"
                                        value={data.manager_name}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 dark:text-gray-400"
                                    />
                                    {formErrors.manager_name && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.manager_name}</div>}
                                </div>

                                {/* Manager Contact */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Contact:</label>
                                    <input
                                        type="text"
                                        value={data.manager_contact_number}
                                        readOnly
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 dark:text-gray-400"
                                    />
                                    {formErrors.manager_contact_number && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.manager_contact_number}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                                        Update Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
