<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;

class DeliveryController extends Controller
{ 
    /**
     * Display a listing of all orders and their deliveries.
     */
    public function index()
    {
        // Fetch all orders regardless of their status and include delivery details
        $orders = Order::with(['items.product', 'user', 'delivery']) // Include delivery data
            ->get();

        // Pass the orders to the Delivery index page
        return Inertia::render('Delivery/Index', [
            'orders' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request input
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'status' => 'required|string', // Should be 'Initiated' at creation
            'title' => 'nullable|string',
            'message' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);
    
        \Log::info('Delivery store request data:', $request->all());
    
        // Create the delivery order
        $delivery = Delivery::create([
            'order_id' => $request->order_id,
            'status' => 'Initiated', // Set to 'Initiated'
            'title' => $request->title,
            'message' => $request->message,
            'image_url' => $request->image_url,
        ]);
    
        // Return a success response
        return response()->json(['message' => 'Delivery order created and order status updated successfully']);
    }

    public function update(Request $request, string $id)
    {
        \Log::info('Request data:', $request->all());

        // Validate request data
        $request->validate([
            'status' => 'nullable|string',
            'title' => 'nullable|string',
            'message' => 'nullable|string',
            'image_url' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $delivery = Delivery::findOrFail($id);
        $data = $request->only(['status', 'title', 'message']);

        // Check if a new image is uploaded
        if ($request->hasFile('image_url')) {
            if ($delivery->image_url) {
                Storage::disk('s3')->delete($delivery->image_url);
            }

            $imagePath = $request->file('image_url')->store('delivery-images', 's3');
            $data['image_url'] = $imagePath;
        }

        $delivery->update($data);

        if ($request->status === 'Completed') {
            $delivery->order->update(['status' => 'Completed']);
        }

        return response()->json(['message' => 'Delivery status updated successfully']);
    }


}
