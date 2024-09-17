<?php

namespace App\Http\Controllers;

use App\Models\ConstructorProject;
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

    public function create()
    {
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
