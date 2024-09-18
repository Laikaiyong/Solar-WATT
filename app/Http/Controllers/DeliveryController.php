<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryController extends Controller
{
 /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $delivery = Delivery::all();
        return Inertia::render('Delivery/Index', [
            'delivery' => $delivery->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all(); // Get all users if needed
        return Inertia::render('Delivery/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
            'title' => 'required|string',
            'status' => 'required|string',
            'message' => 'required|string',
        ]);

        Delivery::create($request->all());

        return redirect()->route('delivery.index')->with('success', 'Delivery created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $delivery = Delivery::findOrFail($id);
        return Inertia::render('Delivery/Show', [
            'delivery' => $delivery,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $delivery = Delivery::findOrFail($id);
        return Inertia::render('Delivery/Edit', [
            'delivery' => $delivery
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        $delivery = Delivery::findOrFail($id);
        $delivery->update($request->all());

        return redirect()->route('delivery.index')->with('success', 'Delivery updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $delivery = Delivery::findOrFail($id);
        $delivery->delete();

        return redirect()->route('delivery.index')->with('success', 'Delivery deleted successfully.');
    }
}
