<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function createOrFetchCart()
    {
        $user = auth()->user(); // Get the authenticated user
        $cart = $this->getOrCreateCart($user); // Call the method with the user object

        return response()->json($cart); // Return the cart as JSON
    }

    protected function getOrCreateCart($user)
    {
        // Check if a cart already exists for the user
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            // If no cart exists, create a new one
            $cart = Cart::create(['user_id' => $user->id]);
        }

        return $cart;
    }


    // Get or create a cart for the authenticated user
    public function getOrCreateCartForUser()
    {
        $user = auth()->user();
        $cart = $this->getOrCreateCart($user);

        return response()->json($cart);
    }

    // Add an item to the cart
    public function addToCart(Request $request)
    {
        $user = auth()->user();

        // Validate product and quantity inputs
        $request->validate([
            'product_id' => 'required|exists:solar_products_services,id', // Check if product exists
            'quantity' => 'required|integer|min:1', // Ensure valid quantity
        ]);

        // Retrieve or create the user's cart using the centralized method
        $cart = $this->getOrCreateCart($user);

        // Check if the product already exists in the cart
        $existingCartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCartItem) {
            // Update the quantity of the existing cart item
            $existingCartItem->quantity += $request->quantity;
            $existingCartItem->save();
        } else {
            // Add a new item to the cart
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        return response()->json(['message' => 'Item added to cart successfully.']);
    }

    // Retrieve all carts with their items
    public function index()
    {
        $user = auth()->user();
        $cart = $this->getOrCreateCart($user); // Ensure user always has a cart

        if (!$cart) {
            return response()->json(['message' => 'No cart found for this user'], 404);
        }

        return response()->json($cart->load('items.product'), 200);
    }

    // Show specific cart and its items
    public function show($id)
    {
        $cart = Cart::with('items.product')->findOrFail($id);
        return response()->json($cart);
    }

    // Update the cart (e.g., update cart items or cart details)
    public function update(Request $request, $id)
    {
        $cart = Cart::findOrFail($id);
        $cart->update($request->all());

        return response()->json($cart);
    }

    // Delete a cart
    public function destroy($id)
    {
        $cart = Cart::findOrFail($id);
        
        // Optionally delete all associated items before deleting the cart
        $cart->items()->delete();
        $cart->delete();

        return response()->json(null, 204);
    }
}
