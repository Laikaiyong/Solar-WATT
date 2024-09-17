<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
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
        $feedbacks = Feedback::with('user')->get();
        return Inertia::render('Feedbacks/Index', [
            'feedbacks' => $feedbacks->toArray(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::all(); // Get all users if needed
        return Inertia::render('Feedbacks/Create', [
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
            'message' => 'required|string',
        ]);

        Feedback::create($request->all());

        return redirect()->route('feedbacks.index')->with('success', 'Feedback created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $feedback = Feedback::with('user')->findOrFail($id);
        return Inertia::render('Feedbacks/Show', [
            'feedback' => $feedback,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $feedback = Feedback::findOrFail($id);
        $users = User::all(); 
        return Inertia::render('Feedbacks/Edit', [
            'feedback' => $feedback,
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

        $feedback = Feedback::findOrFail($id);
        $feedback->update($request->all());

        return redirect()->route('feedbacks.index')->with('success', 'Feedback updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return redirect()->route('feedbacks.index')->with('success', 'Feedback deleted successfully.');
    }
}