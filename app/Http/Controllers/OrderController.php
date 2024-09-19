<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // Debugging: Log the incoming request
        \Log::info('Request data:', $request->all());

        // Create an order
        $order = Order::create([
            'user_id' => $user->id,
            'total_amount' => $request->total,
        ]);

        // Add items to the order
        foreach ($request->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product']['id'],
                'quantity' => $item['quantity'],
                'price' => $item['product']['price'],
            ]);
        }

        return response()->json(['message' => 'Order placed successfully!', 'order' => $order], 201);
    }

    public function show($id)
    {
        $order = Order::with('items')->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->all());
        return response()->json($order);
    }

    public function destroy($id)
    {
        Order::destroy($id);
        return response()->json(null, 204);
    }

    public function getUserOrders()
    {
        $orders = Order::with(['items.product'])->where('user_id', Auth::id())->get();
        return response()->json($orders);
    }
}