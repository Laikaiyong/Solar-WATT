import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ auth }: { auth: any }) {
    const { data, setData, post } = useForm({
        message: "",
    });

    const [formErrors, setFormErrors] = useState<any>({});

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.message) {
            newErrors.message = "Message is required.";
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            post("/feedbacks"); // Adjust the route according to your setup
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Create Feedback
                </h2>
            }
        >
            <Head title="Create Feedback" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            href="/feedbacks"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            &larr; Back to Feedback List
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
                                {/* Message */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Message:
                                    </label>
                                    <textarea
                                        value={data.message}
                                        onChange={(e) =>
                                            setData("message", e.target.value)
                                        }
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />
                                    {formErrors.message && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {formErrors.message}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Submit Feedback
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
