<?php

namespace App\Http\Controllers;

use App\Models\ConstructorProject;
use App\Models\Quotation;
use App\Models\SolarConstructionSite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ConstructorProjectController extends Controller
{
    public function index()
    {
        $projects = ConstructorProject::where('constructor_in_charge', Auth::user()->name)->get();
        return Inertia::render('Constructor/ConstructionProject/Index', ['projects' => $projects]);
    }

    public function create(Request $request)
    {
        // Fetch the solar site details based on the solar_site_id from the query string
        if ($request->has('quotation_id')) {
            $quotation = Quotation::find($request->quotation_id);
            
            // Make sure the quotation exists and has a solar_site_id
            if ($quotation && $quotation->solar_site_id) {
                $solarSite = SolarConstructionSite::find($quotation->solar_site_id);
                
                // Pass the solar site details to the view, including manager_name and manager_contact_number
                return Inertia::render('Constructor/ConstructionProject/Create', [
                    'solar_site' => $solarSite, // Include manager_name and manager_contact_number from the solar site
                    'quotation_id' => $quotation->id // Pass the quotation_id to the view
                ]);
            }
        }
    
        // If no quotation or solar site is found, still load the create view
        return Inertia::render('Constructor/ConstructionProject/Create');
    }
    

    public function store(Request $request)
    {
        $request->validate([
            'project_name' => 'required|string',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'expected_end_date' => 'required|date',
            'manager_name' => 'required|string',
            'manager_contact_number' => 'required|string',
            'status' => 'required|string',
            'quotation_id' => 'required|exists:constructor_quotations,id',
        ]);
    
        // Automatically set constructor_in_charge
        ConstructorProject::create([
            'project_name' => $request->project_name,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'expected_end_date' => $request->expected_end_date,
            'constructor_in_charge' => Auth::user()->name, // Get the constructor's name from the authenticated user
            'manager_name' => $request->manager_name,
            'manager_contact_number' => $request->manager_contact_number,
            'status' => $request->status,
            'quotation_id' => $request->quotation_id,
        ]);

        return redirect()->route('constructor-projects.index');
    }

    public function edit($id)
    {
        $project = ConstructorProject::findOrFail($id);
        return Inertia::render('Constructor/ConstructionProject/Edit', ['project' => $project]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'project_name' => 'required|string',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'expected_end_date' => 'required|date',
            'constructor_in_charge' => 'required|string',
            'manager_name' => 'required|string',
            'manager_contact_number' => 'required|string',
            'status' => 'required|string',
        ]);

        // Find the project based on the project ID
        $project = ConstructorProject::findOrFail($id);

        // Update the project with the validated data
        $project->update($request->all());
        $quotation = Quotation::find($project->quotation_id);
    
        if ($quotation && $quotation->solar_site_id) {
            // Retrieve the related SolarConstructionSite
            $solarSite = SolarConstructionSite::find($quotation->solar_site_id);
            if ($solarSite) {
                // Update the solar site status based on the construction project status
                if ($request->status == 'in_progress') {
                    $solarSite->status = 'under_construction';
                } elseif ($request->status == 'completed') {
                    $solarSite->status = 'active';
                }
                // Save the updated solar site status
                $solarSite->save();
            }
        }

        return redirect()->route('constructor-projects.index')->with('success', 'Project updated successfully');
    }



    public function destroy($id)
    {
        // Find the project by its ID, ensuring it's owned by the authenticated user
        $project = ConstructorProject::where('constructor_in_charge', Auth::user()->name)->findOrFail($id);
        
        // Delete the project
        $project->delete();
    
        // Redirect to the index page with a success message
        return redirect()->route('constructor-projects.index')->with('success', 'Project deleted successfully');
    }
    
}
