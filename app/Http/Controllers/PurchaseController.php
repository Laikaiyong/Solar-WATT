<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::where('user_id', auth()->id())->get();
        return view('purchases.index', compact('purchases'));
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