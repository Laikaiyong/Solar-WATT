<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use Illuminate\Http\Request;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the user's purchases.
     */
    public function index()
    {
        $purchases = Purchase::where('user_id', auth()->id())->get();
        return view('purchases.index', compact('purchases'));
    }

    /**
     * Display the specified purchase details.
     */
    public function show($id)
    {
        $purchase = Purchase::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        return view('purchases.show', compact('purchase'));
    }
}