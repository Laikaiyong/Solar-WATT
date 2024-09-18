<?php

namespace App\Http\Controllers;

use App\Models\Quotation;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class QuotationController extends Controller
{
        // Display a listing of the quotations (READ)
        public function index()
        {
            // Fetch quotations for the authenticated constructor
            $quotations = Quotation::where('constructor_id', Auth::id())->get();
            return Inertia::render('Constructor/Index', ['quotations' => $quotations]);
        }
    
        // Show the form for creating a new quotation (CREATE)
        public function create()
        {
            return Inertia::render('Constructor/Create');
        }
    
        // Store a newly created quotation in storage (CREATE)
        public function store(Request $request)
        {
            $validated = $request->validate([
                'project_name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric',
                'duration' => 'required|numeric',
            ]);
    
            Quotation::create([
                'constructor_id' => auth()->user()->id, // Assuming constructor is logged in
                'project_name' => $validated['project_name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'duration' => $validated['duration'],
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
}
