import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

interface Product {
    id: number;
    name: string;
    price: string;
}

interface Order {
    id: number;
    product_id: number;
    status: string;
}

export default function Edit({
    auth,
    order,
    products,
}: {
    auth: any;
    order: Order;
    products: Product[];
}) {
    const { data, setData, put } = useForm({
        product_id: order.product_id || "",
        status: order.status || "Pending",
    });

    const [formErrors, setFormErrors] = useState<any>({});

    const validate = () => {
        let isValid = true;
        const newErrors: any = {};

        if (!data.product_id) {
            newErrors.product_id = "Product selection is required.";
            isValid = false;
        }

        setFormErrors(newErrors);
        return isValid;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            put(`/orders/${order.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Edit Order
                </h2>
            }
        >
            <Head title="Edit Order" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Back Button */}
                    <div className="mb-4">
                        <Link
                            href="/orders"
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            &larr; Back to Orders List
                        </Link>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={submit}>
                                {/* Product Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Product:
                                    </label>
                                    <select
                                        value={data.product_id}
                                        onChange={(e) =>
                                            setData(
                                                "product_id",
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="">
                                            Select a Product
                                        </option>
                                        {products.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name} - RM
                                                {parseFloat(
                                                    product.price
                                                ).toFixed(2)}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.product_id && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {formErrors.product_id}
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Status:
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mt-1 block w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">
                                            Completed
                                        </option>
                                        <option value="Cancelled">
                                            Cancelled
                                        </option>
                                    </select>
                                    {formErrors.status && (
                                        <div className="text-red-600 text-sm mt-2">
                                            {formErrors.status}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Update Order
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
