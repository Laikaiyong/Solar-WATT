import { Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Project {
    id: number;
    project_name: string;
    description: string;
    start_date: string;
    expected_end_date: string;
    status: string;
    constructor_in_charge: string;
    manager_name: string;
    manager_contact: string;
}

interface ProjectListProps {
    auth: any;
    projects: Project[];
}

export default function ProjectList({ auth, projects }: ProjectListProps) {
    const { delete: destroy } = useForm();
    
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this project?')) {
            destroy(`/constructor-projects/${id}`, {
                method: 'delete',
            });
        }
    };

    const getStatusClasses = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-green-800 border border-green-300 rounded-full px-2 py-1 text-xs';
            case 'in_progress':
                return 'bg-blue-100 text-red-800 border border-red-300 rounded-full px-2 py-1 text-xs';
            case 'completed':
                return 'bg-green-100 text-yellow-800 border border-yellow-300 rounded-full px-2 py-1 text-xs';
            default:
                return '';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Construction Projects</h2>}
        >
            <Head title="Construction Projects" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-x-auto">
                                {projects.length === 0 ? (
                                    <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                                        No On-Going Projects
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Expected End Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Constructor</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                            {projects.map(project => (
                                                <tr key={project.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{project.project_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.description}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.start_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">{project.expected_end_date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(project.status)}`}>
                                                            {project.status}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.constructor_in_charge}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{project.manager_name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {project.status === 'completed' ? (
                                                            <span className="text-green-600 dark:text-green-400">
                                                                Project Completed. No further actions available.
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <Link href={`/constructor-projects/${project.id}/edit`} className="text-blue-600 dark:text-blue-400 hover:underline mr-4">
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    onClick={() => handleDelete(project.id)}
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
                                )}
                            </div>
                            <Link href="/dashboard" className="text-blue-500 hover:text-blue-700 mt-4 inline-block">Back to Dashboard</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
