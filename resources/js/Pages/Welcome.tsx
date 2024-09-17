import React from 'react';
import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Welcome({ auth, laravelVersion, phpVersion }: PageProps<{ laravelVersion: string, phpVersion: string }>) {
    return (
        <>
            <Head title="Welcome to Solar-WATT" />
            <div className="bg-gradient-to-b from-blue-100 to-green-100 text-gray-800 min-h-screen">
                <div className="relative flex flex-col items-center justify-center min-h-screen">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="py-10">
                            <div className="flex justify-center">
                                <svg className="h-16 w-auto text-yellow-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 17L3 8.5L12 0L21 8.5L12 17Z" fill="currentColor"/>
                                    <path d="M12 24L3 15.5L12 7L21 15.5L12 24Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-center mt-4">Welcome to Solar-WATT</h1>
                            <p className="text-xl text-center mt-2">Powering the Future with Solar Energy</p>
                        </header>

                        <nav className="flex justify-center space-x-4 mb-8">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-md px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 transition"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-md px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>

                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold mb-4">For Companies</h2>
                                    <p className="text-gray-700">Manage your solar product manufacturing and distribution with our comprehensive tools.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold mb-4">For Constructors</h2>
                                    <p className="text-gray-700">Access resources and tools for efficient solar panel installation and construction projects.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold mb-4">For Customers</h2>
                                    <p className="text-gray-700">Explore our range of solar products and services to power your home or business sustainably.</p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold mb-4">For Deliverymen</h2>
                                    <p className="text-gray-700">Efficiently manage and track solar product deliveries to ensure customer satisfaction.</p>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-gray-600">
                            Solar-WATT &copy; 2024 | Powered by Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}