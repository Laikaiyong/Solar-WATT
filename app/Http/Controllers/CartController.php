<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function createOrFetchCart()
    {
        $user = auth()->user(); // Get the authenticated user
        $cart = $this->getOrCreateCart($user); // Call the method with the user object

        // Load the cart items with associated product information
        $cart->load('items.product');

        return response()->json($cart); // Return the cart as JSON with its items
    }


    protected function getOrCreateCart($user)
    {
        // Check if a cart already exists for the user
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            // If no cart exists, create a new one
            $cart = Cart::create(['user_id' => $user->id]);
        }

        // Ensure the items are loaded
        $cart->load('items.product'); // Load the cart items with the associated products

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

    public function showCart()
    {
        $user = auth()->user();
        $cart = Cart::where('user_id', $user->id)->with('items.product')->first();

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        return Inertia::render('Customer/Cart/Index', [ // Adjust this path
            'cart' => $cart,
            'items' => $cart->items,  // Pass the cart items to the Inertia page
        ]);
    }

    public function checkout()
    {
        // Get the authenticated user
        $user = auth()->user();
        
        // Load the cart for the user with its items and the related products
        $cart = Cart::where('user_id', $user->id)
                    ->with('items.product') // Ensure product relationship is loaded
                    ->first();

        // If the cart is empty or doesn't exist, redirect back to the cart page
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('warning', 'Your cart is empty!');
        }

        // Render the Inertia checkout page, passing the user, cart, and items
        return Inertia::render('Customer/Cart/Checkout', [
            'auth' => [
                'user' => $user, // Pass the user object properly
            ],
            'cart' => $cart,
            'items' => $cart->items, // Pass cart items for use in the frontend
        ]);
    }

    public function clearCart(Cart $cart)
    {
        // Remove all items in the cart
        $cart->items()->delete();

        return response()->json(['message' => 'Cart cleared successfully'], 200);
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
