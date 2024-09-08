<?php

namespace App\Http\Controllers;

use App\Models\SolarProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SolarProductServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = SolarProductService::all(); // Fetch all products from the database
        return Inertia::render('SolarProductsServices/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SolarProductServices/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
        ]);

        SolarProductService::create($request->all());

        return redirect()->route('solar-products-services.index')->with('success', 'Product/Service created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = SolarProductService::findOrFail($id);
        return Inertia::render('SolarProductServices/Show', [
            'service' => $service
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $service = SolarProductService::findOrFail($id);
        return Inertia::render('SolarProductServices/Edit', [
            'service' => $service
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
        ]);

        $service = SolarProductService::findOrFail($id);
        $service->update($request->all());

        return redirect()->route('solar-products-services.index')->with('success', 'Product/Service updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = SolarProductService::findOrFail($id);
        $service->delete();

        return redirect()->route('solar-products-services.index')->with('success', 'Product/Service deleted successfully.');
    }
}

