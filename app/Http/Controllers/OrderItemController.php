<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function index($order_id)
    {
        $items = OrderItem::where('order_id', $order_id)->get();
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $item = OrderItem::create($request->all());
        return response()->json($item, 201);
    }

    public function show($id)
    {
        $item = OrderItem::findOrFail($id);
        return response()->json($item);
    }

    public function update(Request $request, $id)
    {
        $item = OrderItem::findOrFail($id);
        $item->update($request->all());
        return response()->json($item);
    }

    public function destroy($id)
    {
        OrderItem::destroy($id);
        return response()->json(null, 204);
    }
}
