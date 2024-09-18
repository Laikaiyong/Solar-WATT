<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index()
    {
        $orders = Order::with('user')->get();
        return Inertia::render('Orders/Index', [
            'orders' => $orders->toArray()
        ]);
    }

    /**
     * Show the form for creating a new order.
     */
    public function create()
    {
        return Inertia::render('Orders/Create');
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'status' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        Order::create([
            'status' => $request->status,
            'user_id' => $request->user_id,
            'order_date' => now(), // Automatically set the current date
        ]);

        return redirect()->route('orders.index')->with('success', 'Order created successfully.');
    }

    /**
     * Display the specified order.
     */
    public function show(string $id)
    {
        $order = Order::with('user')->findOrFail($id);
        return Inertia::render('Orders/Show', [
            'order' => $order->toArray()
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(string $id)
    {
        $order = Order::findOrFail($id);
        return Inertia::render('Orders/Edit', [
            'order' => $order->toArray()
        ]);
    }

    /**
     * Update the specified order in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        $order = Order::findOrFail($id);
        $order->update($request->all());

        return redirect()->route('orders.index')->with('success', 'Order updated successfully.');
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully.');
    }

    /**
     * Purchase
     */
    protected function getOrderProducts($order)
    {
        return $order->products->map(function ($product) {
            return [
                'id' => $product->id,
                'quantity' => $product->pivot->quantity,
                'price' => $product->pivot->price,
            ];
        })->toArray();
    }

    public function purchase($id)
    {
        $order = Order::findOrFail($id);

        // Fetch products and quantities for the order
        $products = $this->getOrderProducts($order);

        DB::transaction(function () use ($order, $products) {
            foreach ($products as $product) {
                PurchasedItem::create([
                    'order_id' => $order->id,
                    'solar_product_id' => $product['id'],
                    'quantity' => $product['quantity'],
                    'price' => $product['price'],
                ]);
            }
            
            // Optionally, update the order status or other fields
            $order->status = 'Purchased';
            $order->save();
        });

        return redirect()->route('orders.index')->with('success', 'Order purchased successfully.');
    }
}