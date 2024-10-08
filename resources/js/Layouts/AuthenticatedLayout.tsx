import { useState, PropsWithChildren, ReactNode } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { User } from "@/types";

export default function Authenticated({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <svg
                                        className="h-7 w-auto text-yellow-500"
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
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route("dashboard")}
                                    active={route().current("dashboard")}
                                >
                                    Dashboard
                                </NavLink>

                                {user.role === "constructor" && (
                                    <>
                                        <NavLink
                                            href={route(
                                                "constructor-quotation"
                                            )}
                                            active={route().current(
                                                "constructor-quotation"
                                            )}
                                        >
                                            Quotation
                                        </NavLink>

                                        <NavLink
                                            href={route(
                                                "constructor-projects.index"
                                            )}
                                            active={route().current(
                                                "constructor-projects.index"
                                            )}
                                        >
                                            Construction Projects
                                        </NavLink>
                                        <NavLink href={route('solar-construction-sites.all')} active={route().current('solar-construction-sites.all')}>
                                            Available Sites
                                        </NavLink>
                                    </>
                                )}

                                {user.role === "customer" && (
                                    <>
                                        <NavLink
                                            href={route("product-list.browse")}
                                            active={route().current(
                                                "product-list.browse"
                                            )}
                                        >
                                            Product{" "}
                                        </NavLink>

                                        <NavLink
                                            href={route("order-history.orders")}
                                            active={route().current(
                                                "order-history.orders"
                                            )}
                                        >
                                            Order History
                                        </NavLink>
                                        <NavLink
                                            href={route("feedbacks.index")}
                                            active={route().current(
                                                "feedbacks.index"
                                            )}
                                        >
                                            Feedback
                                        </NavLink>
                                    </>
                                )}

                                {user.role === "delivery" && (
                                    <>
                                        <NavLink
                                            href={route("delivery.index")}
                                            active={route().current(
                                                "delivery.index"
                                            )}
                                        >
                                            Delivery
                                        </NavLink>
                                    </>
                                )}

                                {user.role == "company" && (
                                <>
                                <NavLink href={route('quotations.all')} active={route().current('quotations.all')}>
                                    Site Quotations
                                </NavLink>

                                {/* Link to manage Solar Panel Construction Sites */}
                                <NavLink href={route('solar-construction-sites.index')} active={route().current('solar-construction-sites.index')}
                                >
                                    Construction
                                </NavLink>
                                {/* Link to manage Solar Products & Services */}
                                <NavLink href={route('solar-products-services.index')} active={route().current('solar-products-services.index')}
                                >
                                    Products
                                </NavLink>

                                </>
                    )}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    {user.role === "constructor" && (
                        <>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("constructor-quotation")}
                                    active={route().current(
                                        "constructor-quotation"
                                    )}
                                >
                                    Quotation
                                </ResponsiveNavLink>
                            </div>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("constructor-projects.index")}
                                    active={route().current(
                                        "constructor-projects.index"
                                    )}
                                >
                                    Construction Projects
                                </ResponsiveNavLink>
                            </div>
                        </>
                    )}

                    {user.role === "customer" && (
                        <>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("product-list.browse")}
                                    active={route().current(
                                        "product-list.browse"
                                    )}
                                >
                                    Product
                                </ResponsiveNavLink>
                            </div>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("order-history.orders")}
                                    active={route().current(
                                        "order-history.orders"
                                    )}
                                >
                                    Order History
                                </ResponsiveNavLink>
                            </div>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("feedbacks.index")}
                                    active={route().current("feedbacks.index")}
                                >
                                    Feedback
                                </ResponsiveNavLink>
                            </div>
                        </>
                    )}

                    {user.role === "delivery" && (
                        <>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route("delivery.index")}
                                    active={route().current("delivery.index")}
                                >
                                    Delivery
                                </ResponsiveNavLink>
                            </div>
                        </>
                    )}

                    {user.role == "company" && (
                        <>
                            {/* Link to manage Solar Panel Construction Sites */}
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route(
                                        "solar-construction-sites.index"
                                    )}
                                    active={route().current(
                                        "solar-construction-sites.index"
                                    )}
                                >
                                    Construction
                                </ResponsiveNavLink>
                            </div>
                            <div className="pt-2 pb-3 space-y-1">
                                <ResponsiveNavLink
                                    href={route(
                                        "solar-products-services.index"
                                    )}
                                    active={route().current(
                                        "solar-products-services.index"
                                    )}
                                >
                                    Products
                                </ResponsiveNavLink>
                            </div>
                        </>
                    )}

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
