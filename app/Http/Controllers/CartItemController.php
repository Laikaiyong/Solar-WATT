<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartItemController extends Controller
{
    // Retrieve all items in the cart
    public function index($cart_id)
    {
        $items = CartItem::where('cart_id', $cart_id)->with('product')->get(); // Ensure the product details are included
        return response()->json($items);
    }


    // Add an item to the cart
    public function store(Request $request)
    {
        $user = auth()->user();
        $cart = $user->cart; // Ensure you get the correct cart for the authenticated user

        if (!$cart) {
            return response()->json(['message' => 'No cart found for this user'], 404);
        }

        // Validate the input
        $request->validate([
            'product_id' => 'required|exists:solar_products_services,id',
            'quantity' => 'required|integer|min:1',
        ]);        

        // Check if the product is already in the cart
        $existingItem = CartItem::where('cart_id', $cart->id)
                                ->where('product_id', $request->product_id)
                                ->first();

        if ($existingItem) {
            // If the item exists, update its quantity
            $existingItem->quantity += $request->quantity;
            $existingItem->save();
        } else {
            // If the item does not exist, create a new cart item
            $newItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Item added to cart successfully.']);
    }

    // Method to count cart items for the current user
    public function count()
    {
        $user = auth()->user();
        $cart = $user->cart;

        if ($cart) {
            $cartItemCount = $cart->items()->count();
            return response()->json([
                'cartItemCount' => $cartItemCount,
                'cartId' => $cart->id,
            ]);
        } else {
            return response()->json([
                'cartItemCount' => 0,
                'cartId' => null,
            ]);
        }
    }

    // Show a specific cart item
    public function show($id)
    {
        $item = CartItem::findOrFail($id);
        return response()->json($item);
    }

    // Update a cart item (e.g., change quantity)
    public function update(Request $request, $id)
    {
        $item = CartItem::findOrFail($id);

        // Validate the request
        $request->validate([
            'quantity' => 'required|integer|min:1', // Ensure quantity is valid
        ]);

        $item->update($request->only('quantity')); // Only update the quantity
        return response()->json($item);
    }

    // Remove a cart item
    public function destroy($id)
    {
        $item = CartItem::findOrFail($id);
        $item->delete(); // Soft delete or hard delete based on your preference
        return response()->json(null, 204);
    }
}
