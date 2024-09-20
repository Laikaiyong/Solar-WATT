<?php

namespace App\Http\Controllers;

use App\Models\Feedbacks;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feedbacks = Feedbacks::with('user')->get();
        return Inertia::render('Customer/Feedbacks/Index', [
            'feedbacks' => $feedbacks->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all(); // Get all users if needed
        return Inertia::render('Customer/Feedbacks/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:solar_products_services,id',
            'message' => 'required|string',
        ]);

        Feedbacks::create($request->all());

        return redirect()->route('feedbacks.index')->with('success', 'Feedback created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $feedback = Feedbacks::with('user')->findOrFail($id);
        return Inertia::render('Customer/Feedbacks/Show', [
            'feedbacks' => $feedback,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $feedback = Feedbacks::findOrFail($id);
        $users = User::all(); 
        return Inertia::render('Customer/Feedbacks/Edit', [
            'feedbacks' => $feedback,
            'users' => $users,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $feedback = Feedbacks::findOrFail($id);
        $feedback->update($request->all());

        return redirect()->route('feedbacks.index')->with('success', 'Feedback updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $feedback = Feedbacks::findOrFail($id);
        $feedback->delete();

        return redirect()->route('feedbacks.index')->with('success', 'Feedback deleted successfully.');
    }
}