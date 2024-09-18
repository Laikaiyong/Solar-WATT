<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchasedItems = PurchasedItem::whereHas('order', function ($query) {
            $query->where('user_id', auth()->id());
        })->with('solar_product')->get();

        return Inertia::render('Customer/PurchaseHistory/Index', [
            'purchasedItems' => $purchasedItems,
        ]);
    }

    public function show($id)
    {
        $purchase = Purchase::findOrFail($id);
        return view('purchases.show', compact('purchase'));
    }
    
    // public function destroy($id)
    // {
    //     $purchase = Purchase::findOrFail($id);
    //     $purchase->delete();

    //     return redirect()->route('purchases.index');
    // }
}