<?php

namespace App\Http\Controllers;

use App\Models\SolarProductService;
use App\Models\SolarConstructionSite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SolarProductServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all products including the related solar_site
        $products = SolarProductService::with('solarSite')->get(); 

        return Inertia::render('SolarProductsServices/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all solar construction sites for the dropdown
        $sites = SolarConstructionSite::all();

        return Inertia::render('SolarProductsServices/Create', [
            'sites' => $sites
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:Product,Service',
            'price' => 'nullable|numeric',
            'availability' => 'required|string',
            'solar_site_id' => 'nullable|exists:solar_construction_sites,id'
        ]);

        SolarProductService::create($request->all());

        return redirect()->route('solar-products-services.index')->with('success', 'Product/Service created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = SolarProductService::with('solarSite')->findOrFail($id);
        return Inertia::render('SolarProductsServices/Show', [
            'service' => $service
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $service = SolarProductService::with('solarSite')->findOrFail($id);
        $sites = SolarConstructionSite::all(); // Get all sites for the dropdown

        return Inertia::render('SolarProductsServices/Edit', [
            'service' => $service,
            'sites' => $sites
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
            'type' => 'required|in:Product,Service',
            'price' => 'nullable|numeric',
            'availability' => 'required|string',
            'solar_site_id' => 'nullable|exists:solar_construction_sites,id'
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
