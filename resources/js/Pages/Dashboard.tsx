import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Link } from "@inertiajs/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Rectangle,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from "recharts";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";

const AnalyticalDashboard  = ({
    auth,
    users,
    orders,
    products,
    projects,
    quotations,
    feedbacks,
    deliveries,
    userRole,
}: PageProps) => {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const renderUserSection = () => (
        <Card className="mb-4">
            <CardHeader>User Statistics</CardHeader>
            <CardContent>
                <p>Total Users: {users.total}</p>
                <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                    outerRadius="80%"
                    data={[
                        { subject: "Customer", value: users.customers },
                        { subject: "Companies", value: users.companies },
                        { subject: "Deliveries", value: users.deliveries },
                        { subject: "Constructors", value: users.constructors },
                    ]}
                >
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis  />
                    <Tooltip />
                    <Radar
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                    />
                </RadarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderOrderSection = () => (
        <Card className="mb-4">
            <CardHeader>Order Statistics</CardHeader>
            <CardContent>
                <p>Total: {orders.total}</p>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={[
                            { name: "Pending", value: orders.pending },
                            { name: "Completed", value: orders.completed },
                            { name: "Cancelled", value: orders.cancelled },
                        ]}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                            formatter={function (total) {
                                return `${total}`;
                            }}
                        />
                        {/* <Bar dataKey="value" fill="#8884d8" /> */}
                        <Bar dataKey="value">
                            {[
                                { name: "Pending", value: orders.pending },
                                { name: "Completed", value: orders.completed },
                                { name: "Cancelled", value: orders.cancelled },
                            ].map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderProductSection = () => (
        <Card className="mb-4">
            <CardHeader>Product/Service Statistics</CardHeader>
            <CardContent>
                <p>Total Products/Services: {products.total}</p>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            dataKey="value"
                            data={[
                                { name: "Products", value: products.products },
                                { name: "Services", value: products.services },
                            ]}
                        >
                            {[
                                { name: "Products", value: products.products },
                                { name: "Services", value: products.services },
                            ].map((entry, index) => (
                                <Cell fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderProjectSection = () => (
        <Card className="mb-4">
            <CardHeader>Project Statistics</CardHeader>
            <CardContent>
                <p>Total: {projects.total}</p>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={[
                            { name: "Pending", value: projects.pending },
                            { name: "In Progress", value: projects.inProgress },
                            { name: "Completed", value: projects.completed },
                        ]}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                            {[
                                { name: "Pending", value: projects.pending },
                                { name: "In Progress", value: projects.inProgress },
                                { name: "Completed", value: projects.completed },
                            ].map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

    const renderQuotationSection = () => (
        <Card className="mb-4">
            <CardHeader>Quotation Statistics</CardHeader>
            <CardContent>
                <p>Total Quotations: {quotations.total}</p>
            </CardContent>
        </Card>
    );

    const renderFeedbackSection = () => (
        <Card className="mb-4">
            <CardHeader>Feedback Statistics</CardHeader>
            <CardContent>
                <p>Total Feedbacks: {feedbacks.total}</p>
            </CardContent>
        </Card>
    );

    const renderDeliverySection = () => (
        <Card className="mb-4">
            <CardHeader>Delivery Statistics</CardHeader>
            <CardContent>
                <p>Total: {deliveries.total}</p>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={[
                            { name: "Initiated", value: deliveries.initiated },
                            { name: "Delivering", value: deliveries.delivering },
                            { name: "Delivered", value: deliveries.delivered },
                        ]}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value">
                            {[
                                  { name: "Initiated", value: deliveries.initiated },
                                  { name: "Delivering", value: deliveries.delivering },
                                  { name: "Delivered", value: deliveries.delivered },
                            ].map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % 20]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );

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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid lg:grid-cols-2 grid-cols-1 lg:gap-4">
                    {userRole === "company" && (
                        <>
                            {renderUserSection()}
                            {renderOrderSection()}
                            {renderProductSection()}
                            {renderProjectSection()}
                            {renderQuotationSection()}
                            {renderFeedbackSection()}
                            {renderDeliverySection()}
                        </>
                    )}
                    {userRole === "customer" && (
                        <>
                            {renderOrderSection()}
                            {renderProductSection()}
                            {renderFeedbackSection()}
                        </>
                    )}
                    {userRole === "delivery" && (
                        <>
                            {renderOrderSection()}
                            {renderDeliverySection()}
                        </>
                    )}
                    {userRole === "constructor" && (
                        <>
                            {renderProjectSection()}
                            {renderQuotationSection()}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AnalyticalDashboard;
