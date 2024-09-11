import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";

export default function Dashboard({ auth }: PageProps) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {auth.user.role == "company" ? (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <p>
                                    Welcome to the Company Panel! Here you can
                                    manage your solar panel projects and
                                    services.
                                </p>
                                <div className="mt-4">
                                    {/* Link to manage Solar Panel Construction Sites */}
                                    <Link
                                        href="/solar-construction-sites"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Manage Solar Panel Construction Sites
                                    </Link>
                                </div>
                                <div className="mt-2">
                                    {/* Link to manage Solar Products & Services */}
                                    <Link
                                        href="/solar-products-services"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Manage Solar Products & Services
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : auth.user.role == "customer" ? (
                        // Customer Role Panel
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <p>
                                    Welcome to the Customer Panel! Here you can
                                    view and manage your purchases, give
                                    feedback, and explore solar products.
                                </p>
                                <div className="mt-4">
                                    <Link
                                        href="/product-list"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Browse Solar Products & Services
                                    </Link>
                                </div>
                                <div className="mt-2">
                                    <Link
                                        href="/purchases"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        View Purchase History
                                    </Link>
                                </div>
                                <div className="mt-2">
                                    <Link
                                        href="/feedback"
                                        className="text-blue-600 dark:text-blue-400 hover:underline"
                                    >
                                        Give Feedback and Suggestions
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                You're logged in!
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
