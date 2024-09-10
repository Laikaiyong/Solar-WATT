import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { PropsWithChildren } from "react";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-b from-blue-100 to-green-100">
            <div>
                <Link href="/">
                    <div className="flex justify-center">
                        <svg
                            className="h-16 w-auto text-yellow-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 17L3 8.5L12 0L21 8.5L12 17Z"
                                fill="currentColor"
                            />
                            <path
                                d="M12 24L3 15.5L12 7L21 15.5L12 24Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
