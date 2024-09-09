<?php

namespace App\Http\Controllers;

use App\Models\SolarConstructionSite;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SolarConstructionSiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all sites from the database
        $sites = SolarConstructionSite::all(); 
        return Inertia::render('SolarConstructionSites/Index', ['sites' => $sites]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SolarConstructionSites/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'capacity' => 'nullable|integer',
            'manager_name' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Under Construction,Inactive',
        ]);

        // Create a new SolarConstructionSite
        SolarConstructionSite::create($validated);

        // Redirect to the index page with success message
        return redirect()->route('solar-construction-sites.index')->with('success', 'Site created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $site = SolarConstructionSite::findOrFail($id);
        return Inertia::render('SolarConstructionSites/Show', ['site' => $site]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $site = SolarConstructionSite::findOrFail($id);
        return Inertia::render('SolarConstructionSites/Edit', ['site' => $site]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'capacity' => 'nullable|integer',
            'manager_name' => 'nullable|string|max:255',
            'status' => 'required|string|in:Active,Under Construction,Inactive',
        ]);

        // Find the SolarConstructionSite and update it
        $site = SolarConstructionSite::findOrFail($id);
        $site->update($validated);

        // Redirect back with a success message
        return redirect()->route('solar-construction-sites.index')->with('success', 'Site updated successfully.');
    }

    /**
     * Remove the specified resource from storage

     */
    public function destroy(string $id)
    {
        //
    }
}
