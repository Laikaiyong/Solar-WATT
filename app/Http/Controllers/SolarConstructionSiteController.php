<?php

namespace App\Http\Controllers;

use App\Models\SolarConstructionSite;
use App\Models\Quotation;
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
        return Inertia::render('Company/SolarConstructionSites/Index', ['sites' => $sites]);
    }

    public function allSites()
    {
        // Fetch all sites from the database
        $sites = SolarConstructionSite::all();
        $quotations = Quotation::where('constructor_id', auth()->user()->id)->get();

        return Inertia::render('Company/SolarConstructionSites/Sites', [
            'auth' => auth()->user(),  // Check if this is correctly passed
            'sites' => $sites,
            'quotations' => $quotations,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Company/SolarConstructionSites/Create');
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
            'status' => 'required|string|in:Pending,Active,Under Construction,Inactive',
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
        return Inertia::render('Company/SolarConstructionSites/Show', ['site' => $site]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $site = SolarConstructionSite::findOrFail($id);
        return Inertia::render('Company/SolarConstructionSites/Edit', ['site' => $site]);
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
            'status' => 'required|string|in:Pending,Active,Under Construction,Inactive',
        ]);

        // Find the SolarConstructionSite and update it
        $site = SolarConstructionSite::findOrFail($id);
        $site->update($validated);

        // Redirect back with a success message
        return redirect()->route('solar-construction-sites.index')->with('success', 'Site updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Find the SolarConstructionSite by ID
        $site = SolarConstructionSite::findOrFail($id);

        // Delete the site
        $site->delete();

        // Redirect back to the index page with a success message
        return redirect()->route('solar-construction-sites.index')->with('success', 'Site deleted successfully.');
    }

    /**
     * Update the status of a specific SolarConstructionSite.
     */
    public function updateStatus(Request $request, string $id)
    {

        // Validate that only the status is being updated
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Active,Under Construction,Inactive',
        ]);

        // Log the status being passed in the request
        \Log::info("Updating site status to: " . $validated['status']);

        // Find the SolarConstructionSite by ID
        $site = SolarConstructionSite::findOrFail($id);

        // Log the current status before updating
        \Log::info("Current site status: " . $site->status);

        // Update the site's status
        $site->update([
            'status' => $validated['status'],
        ]);

        // Log the status after updating
        \Log::info("Updated site status to: " . $site->status);

        // Return a response to indicate success
        return redirect()->back()->with('success', 'Site status updated successfully.');
    }

}