<?php

namespace App\Http\Controllers;

use App\Models\SolarProductService;
use App\Models\SolarConstructionSite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SolarProductServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = SolarProductService::with('solarSite')->get();
        return Inertia::render('Company/SolarProductsServices/Index', [
            'products' => $products->toArray() // Ensure data is converted to array
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get all solar construction sites for the dropdown
        $solarSites = SolarConstructionSite::all();

        return Inertia::render('Company/SolarProductsServices/Create', [
            'solarSites' => $solarSites
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
            'type' => 'required|string',
            'price' => 'nullable|numeric',
            'availability' => 'required|string',
            'solar_site_id' => 'required|integer',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Validate image
        ]);

        $data = $request->only(['name', 'description', 'type', 'price', 'availability', 'solar_site_id']);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 's3'); // Store image in S3
            $data['image_path'] = $imagePath; // Save image path
        }

        SolarProductService::create($data);

        return redirect()->route('solar-products-services.index')->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = SolarProductService::with('solarSite')->findOrFail($id);
        return Inertia::render('Company/SolarProductsServices/Show', [
            'service' => $service
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = SolarProductService::findOrFail($id);
        $solarSites = SolarConstructionSite::all(); 
        return Inertia::render('Company/SolarProductsServices/Edit', [
            'product' => $product,
            'solarSites' => $solarSites
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
            'solar_site_id' => 'nullable|exists:solar_construction_sites,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $service = SolarProductService::findOrFail($id);

        // Get the existing data
        $data = $request->only(['name', 'description', 'type', 'price', 'availability', 'solar_site_id']);

        // Check if a new image is uploaded
        if ($request->hasFile('image')) {
            // Delete the old image from S3
            if ($service->image_path) {
                Storage::disk('s3')->delete($service->image_path);
            }

            // Store the new image in S3 and update the image path
            $imagePath = $request->file('image')->store('images', 's3');
            $data['image_path'] = $imagePath;
        }

        // Update the product with new data
        $service->update($data);

        return redirect()->route('solar-products-services.index')->with('success', 'Product/Service updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $service = SolarProductService::findOrFail($id);

        if ($service->image_path) {
            Storage::disk('s3')->delete($service->image_path);
        }

        $service->delete();

        return redirect()->route('solar-products-services.index')->with('success', 'Product/Service deleted successfully.');
    }

    /**
     * Display a listing of the solar products and services.
     */
    public function browse()
    {
        $products = SolarProductService::with('solarSite')->get();

    return Inertia::render('Customer/Products/Index', [
        'products' => $products->toArray(),
    ]);
    }


    public function getProductsByIds(Request $request)
    {
        $ids = $request->query('ids'); // Retrieve IDs from query parameter
        $products = SolarProductService::whereIn('id', $ids)->get();
        return response()->json($products);
    }

}