<?php

namespace App\Http\Controllers;

use App\Models\SolarConstructionSite;
use App\Models\Quotation;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class QuotationController extends Controller
{

        public function all()
        {
            // Fetch all quotations with related constructor details
            $quotations = Quotation::with('constructor')->get();
            
            // Return the view with quotations data
            return Inertia::render('Constructor/Allquotation', ['quotations' => $quotations]);
        }
    
        public function index()
        {
            // Fetch quotations for the authenticated constructor with the related project
            $quotations = Quotation::with('project') // Load the related project
                ->where('constructor_id', Auth::id())
                ->get()
                ->map(function ($quotation) {
                    // Add a flag to indicate if a project already exists for this quotation
                    $quotation->hasProject = $quotation->project ? true : false;
                    return $quotation;
                });
            return Inertia::render('Constructor/Index', ['quotations' => $quotations]);
        }
    
        // Show the form for creating a new quotation (CREATE)
        public function create(Request $request)
        {
            $solar_site_id = $request->query('solar_site_id');
            $solarSite = SolarConstructionSite::findOrFail($solar_site_id);

            return Inertia::render('Constructor/Create', [
                'solar_site_id' => $solar_site_id,
                'solar_site_name' => $solarSite ? $solarSite->name : null
            ]);
        }
    
        // Store a newly created quotation in storage (CREATE)
        public function store(Request $request)
        {
            $validated = $request->validate([
                'project_name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'duration' => 'required|numeric',
                //solar site id read from table
                'solar_site_id' => 'required|numeric',
                //status peding, accepted, rejected 
                'status' => 'required|string|in:Pending,Accepted,Rejected',
            ]);
    
            Quotation::create([
                'constructor_id' => auth()->user()->id, // Assuming constructor is logged in
                'project_name' => $validated['project_name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'duration' => $validated['duration'],
                'solar_site_id' => $validated['solar_site_id'],
            ]);
    
            return redirect()->route('quotations.index')->with('success', 'Quotation created successfully');
        }
    
        // Show the form for editing a specific quotation (UPDATE)
        public function edit($id)
        {
            $quotation = Quotation::where('constructor_id', Auth::id())->findOrFail($id);
            return Inertia::render('Constructor/Edit', ['quotation' => $quotation]);
        }
    
        // Update the specified quotation in storage (UPDATE)
        public function update(Request $request, $id)
        {
            $request->validate([
                'project_name' => 'required',
                'description' => 'required',
                'price' => 'required|numeric',
                'duration' => 'required|numeric',
            ]);
    
            $quotation = Quotation::where('constructor_id', Auth::id())->findOrFail($id);
            $quotation->update($request->all());
    
            return redirect()->route('quotations.index')->with('success', 'Quotation updated successfully');
        }
    
        // Remove the specified quotation from storage (DELETE)
        public function destroy($id)
        {
            $quotation = Quotation::where('constructor_id', Auth::id())->findOrFail($id);
            $quotation->delete();
    
            return redirect()->route('quotations.index')->with('success', 'Quotation deleted successfully');
        }

        // Approving Quotation - For Company Usage
        public function approve($id)
        {
            // Fetch the approved quotation
            $quotation = Quotation::findOrFail($id);

            // Set the status to 'Accepted'
            $quotation->status = 'Accepted';
            $quotation->save();

            // Reject all other pending quotations for the same solar site
            Quotation::where('solar_site_id', $quotation->solar_site_id)
                ->where('id', '!=', $id) // Exclude the approved quotation
                ->where('status', 'Pending') // Only reject pending quotations
                ->update(['status' => 'Rejected']); // Set status to 'Rejected'

            return redirect()->route('quotations.all')->with('success', 'Quotation approved successfully');
        }

        // Rejecting Quotation - For Company Usage
        public function reject($id)
        {
            // Find the quotation without checking for constructor_id
            $quotation = Quotation::findOrFail($id);

            // Update the status to 'Rejected'
            $quotation->status = 'Rejected';
            $quotation->save();

            return redirect()->route('quotations.all')->with('success', 'Quotation rejected successfully');
        }

        public function show($id)
        {
            $quotation = Quotation::findOrFail($id);
            return response()->json($quotation);
        }
}
