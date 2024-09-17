import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateProject({ auth }: { auth: any }) {
    const { data, setData, post, errors, processing } = useForm({
        project_name: '',
        description: '',
        start_date: '',
        expected_end_date: '',
        status: '',
        constructor_in_charge: '',
        manager_name: '',
        manager_contact_number: '',
    });

    const [formErrors, setFormErrors] = useState<any>({});

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.project_name) {
            newErrors.project_name = 'Project Name is required.';
            isValid = false;
        }
        if (!data.description) {
            newErrors.description = 'Description is required.';
            isValid = false;
        }
        if (!data.start_date) {
            newErrors.start_date = 'Start Date is required.';
            isValid = false;
        }
        if (!data.expected_end_date) {
            newErrors.expected_end_date = 'Expected End Date is required.';
            isValid = false;
        }
        if (!data.status || !['pending', 'in_progress', 'completed'].includes(data.status)) {
            newErrors.status = 'Status is required and must be one of "pending", "in_progress", or "completed".';
            isValid = false;
        }
        if (!data.manager_name) {
            newErrors.manager_name = 'Manager Name is required.';
            isValid = false;
        }

        // Validate manager contact number (should be numeric only)
        const contactNumberPattern = /^[0-9]+$/;
        if (!data.manager_contact_number) {
            newErrors.manager_contact_number = 'Manager Contact is required.';
            isValid = false;
        } else if (!contactNumberPattern.test(data.manager_contact_number)) {
            newErrors.manager_contact_number = 'Manager Contact must contain only numbers.';
            isValid = false;
        }

        // Validate start date (should be the next day or later)
        if (data.start_date && new Date(data.start_date) < tomorrow) {
            newErrors.start_date = 'Start date should be at least the next day from today.';
            isValid = false;
        }

        // Validate end date (should be at least 1 month after start date)
        if (data.start_date && data.expected_end_date) {
            const startDate = new Date(data.start_date);
            const expectedEndDate = new Date(data.expected_end_date);
            const minEndDate = new Date(startDate);
            minEndDate.setMonth(minEndDate.getMonth() + 1);

            if (expectedEndDate < minEndDate) {
                newErrors.expected_end_date = 'Expected end date should be at least 1 month from the start date.';
                isValid = false;
            }
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
    
        console.log("Submit button clicked");
        
        if (validate()) {
            console.log("Validation passed");
            const formData = {
                ...data,
                constructor_in_charge: auth.user.name,
                manager_contact_number: String(data.manager_contact_number),
            };
            console.log("Form Data:", formData);
    
            post('/constructor-projects', {
                data: formData,
                onSuccess: () => {
                    console.log("Form submitted successfully");
                    window.location.href = '/constructor-projects';
                },
                onError: (errors) => {
                    console.log("Form submission error", errors);
                }
            });
        } else {
            console.log("Validation failed", formErrors);
        }
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Create New Project</h2>}
        >
            <Head title="Create Project" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('constructor-projects.index')}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            &larr; Back to Project List
                        </Link>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            

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
                                    {formErrors.project_name && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.project_name}</div>}
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description:</label>
                                    <textarea
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.description && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.description}</div>}
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
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200
                                        focus:ring-opacity-50"
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
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Constructor in Charge:
                                    </label>
                                    <input
                                        type="text"
                                        value={auth.user.name} // Automatically load current user's name
                                        readOnly // Make the input field not editable
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
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
                                    {formErrors.manager_name && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.manager_name}</div>}
                                </div>

                                {/* Manager Contact */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager Contact:</label>
                                    <input
                                        type="text"
                                        value={data.manager_contact_number}
                                        onChange={e => setData('manager_contact_number', e.target.value)}
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.manager_contact_number && <div className="text-red-600 dark:text-red-400 text-sm mt-2">{formErrors.manager_contact_number}</div>}
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                                    >
                                        Create Project
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
