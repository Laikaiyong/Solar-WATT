import { useState, useEffect } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface OrderItem {
    id: number;
    product: {
        name: string;
    };
    quantity: number;
}

interface Delivery {
    id: number;
    status: string;
    order_id: number;
    title: string;
    message: string;
    image_url?: string;  // Image URL for proof of delivery
}

interface Order {
    id: number;
    status: string;
    user: {
        address: string;
    };
    items: OrderItem[];
    delivery?: Delivery | null; 
}

export default function DeliveryManIndex({ auth, orders }: { auth: any; orders: Order[] }) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
    const [deliveryMessage, setDeliveryMessage] = useState<string>('');
    const [proofImage, setProofImage] = useState<File | null>(null);  // Proof of delivery image

    // Function to generate title and message
    const generateTitleAndMessage = (orderId: number) => {
        const title = `Delivery Order #${orderId} Initiated`;
        const message = `The delivery process for your order #${orderId} has been initiated. Your parcel is being arranged for delivery.`;
        return { title, message };
    };

    // Function to handle delivery creation
    const createDeliveryOrder = async (orderId: number) => {
        try {
            const { title, message } = generateTitleAndMessage(orderId);

            // Send POST request to create the delivery order
            const response = await axios.post(`/delivery`, {
                order_id: orderId,
                status: 'Initiated',
                title,
                message,
                image_url: 'null', // Placeholder string for image URL
            });

            const newDelivery = response.data.delivery;

            // Store success flag in localStorage to show toast after page reload
            localStorage.setItem('deliveryCreateSuccess', 'true');
            window.location.reload(); // Reload the page to reflect the new delivery order

        } catch (error: any) {
            console.error('Failed to create delivery order:', error.response ? error.response.data : error.message);
            toast.error('Failed to create delivery order');
        }
    };

    // Function to handle "Out for Delivery" status update
    const markAsOutForDelivery = async (deliveryId: number, orderId: number) => {
        try {
            const title = `Delivery Order #${orderId} Out for Delivery`;
            const message = `Your order #${orderId} is on its way! The parcel has been dispatched and will be delivered soon.`;

            const response = await axios.put(`/delivery/${deliveryId}`, {
                status: 'Delivering',
                title,  
                message,
            });

            if (response.status === 200) {
                localStorage.setItem('deliveryUpdateSuccess', 'true');
                window.location.reload(); 
            }
        } catch (error: any) {
            console.error('Failed to update delivery status:', error.response ? error.response.data : error.message);
            toast.error('Failed to update delivery status');
        }
    };

    const markAsDelivered = async (deliveryId: number, orderId: number) => {
        try {
            const title = `Delivery Order #${orderId} Completed`;
            const message = deliveryMessage || `Your order #${orderId} has been successfully delivered. Thank you for your purchase!`;
        
            const formData = new FormData();
            formData.append('status', 'Completed');
            formData.append('title', title);
            formData.append('message', message);
        
            if (proofImage) {
                formData.append('image_url', proofImage);
            }
    
            // Log formData to ensure it's being sent properly
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
    
            const response = await axios.post(`/delivery/${deliveryId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 200) {
                localStorage.setItem('deliveryDeliveredSuccess', 'true');
                window.location.reload();
            } else {
                throw new Error('Failed to mark as delivered.');
            }
        } catch (error: any) {
            console.error('Failed to update delivery status:', error.response ? error.response.data : error.message);
            toast.error('Failed to update delivery status');
        }
    };         

    // Check for success flag in localStorage and trigger toast
    useEffect(() => {
        const deliveryCreateSuccess = localStorage.getItem('deliveryCreateSuccess');
        if (deliveryCreateSuccess) {
            toast.success('Delivery order created successfully');
            localStorage.removeItem('deliveryCreateSuccess');
        }

        const deliveryUpdateSuccess = localStorage.getItem('deliveryUpdateSuccess');
        if (deliveryUpdateSuccess) {
            toast.success('Delivery status updated to Delivering');
            localStorage.removeItem('deliveryUpdateSuccess');
        }

        const deliveryDeliveredSuccess = localStorage.getItem('deliveryDeliveredSuccess');
        if (deliveryDeliveredSuccess) {
            toast.success('Delivery status updated to Delivered');
            localStorage.removeItem('deliveryDeliveredSuccess');
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Customer Orders
                    </h2>
                </div>
            }
        >
            <Head title="Delivery Orders" />

            <ToastContainer />

            <div className="py-10 flex">
                <div className="w-1/4 border-r border-gray-300 dark:border-gray-700 p-4">
                    <h3 className="text-lg font-semibold mb-4">Orders</h3>
                    <ul>
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                className={`cursor-pointer p-2 rounded-md mb-2 ${
                                    selectedOrder?.id === order.id ? 'bg-blue-100' : 'bg-white dark:bg-gray-800'
                                }`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.delivery ? order.delivery.status : 'Pending'}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-3/4 p-6">
                    {selectedOrder ? (
                        <div>
                            <div className="my-4">
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                            selectedOrder.delivery?.status === 'Initiated' ? 'bg-blue-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        1
                                    </div>
                                    <div className="flex-1 h-1 bg-gray-300"></div>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                            selectedOrder.delivery?.status === 'Delivering' ? 'bg-yellow-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        2
                                    </div>
                                    <div className="flex-1 h-1 bg-gray-300"></div>
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                                            selectedOrder.delivery?.status === 'Completed' ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    >
                                        3
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-sm">
                                    <span>Initiated</span>
                                    <span>Delivering</span>
                                    <span>Delivered</span>
                                </div>
                            </div>

                            <h4 className="font-semibold text-lg">Order #{selectedOrder.id}</h4>
                            <p><strong>Delivery Address:</strong> {selectedOrder.user.address}</p>
                            <p><strong>Order Status:</strong> {selectedOrder.status}</p>

                            <div className="mt-4">
                                <h5 className="font-semibold">Items:</h5>
                                <ul>
                                    {selectedOrder.items.map((item) => (
                                        <li key={item.id} className="ml-4 list-disc">
                                            {item.product.name} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {selectedOrder.delivery ? (
                                <div className="mt-6">
                                    <h5 className="font-semibold">Delivery Details:</h5>
                                    <p><strong>Title:</strong> {selectedOrder.delivery.title}</p>
                                    <p><strong>Message:</strong> {selectedOrder.delivery.message}</p>
                                    <p><strong>Status:</strong> {selectedOrder.delivery.status}</p>

                                    {selectedOrder.delivery.status === 'Initiated' && (
                                        <button
                                            className="mt-4 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                                            onClick={() => markAsOutForDelivery(selectedOrder.delivery!.id, selectedOrder.id)}
                                        >
                                            Out For Delivery
                                        </button>
                                    )}

                                    {selectedOrder.delivery.status === 'Delivering' && (
                                        <>
                                            <textarea
                                                value={deliveryMessage}
                                                onChange={(e) => setDeliveryMessage(e.target.value)}
                                                placeholder="Leave a message for the customer (e.g., I left the parcel at the gate)."
                                                className="w-full p-2 border border-gray-300 rounded-md mt-4"
                                            />

                                            {/* Image input for proof of delivery */}
                                            <input
                                                type="file"
                                                name="proof_of_delivery"
                                                id="proof_of_delivery"
                                                accept="image/*"
                                                onChange={(e) => setProofImage(e.target.files ? e.target.files[0] : null)}
                                                className="w-full p-2 border border-gray-300 rounded-md mt-4"
                                            />


                                            <button
                                                className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                                                onClick={() => markAsDelivered(selectedOrder.delivery!.id, selectedOrder.id)}
                                            >
                                                Mark as Delivered
                                            </button>
                                        </>
                                    )}

                                    {selectedOrder.delivery.status === 'Completed' && (
                                        <p className="mt-4 text-gray-500">Delivery Completed</p>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => createDeliveryOrder(selectedOrder.id)}
                                    className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Create Delivery Order
                                </button>
                            )}
                        </div>
                    ) : (
                        <p>Select an order to view details.</p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
