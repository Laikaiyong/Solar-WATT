<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle profile image
        if (isset($data['profile']) && strpos($data['profile'], 'data:image') === 0) {
            // Delete the old image from S3 if it exists
            if ($user->profile && Storage::disk('s3')->exists($user->profile)) {
                Storage::disk('s3')->delete($user->profile);
            }

            // Extract image data
            $image_parts = explode(";base64,", $data['profile']);
            $image_type_aux = explode("image/", $image_parts[0]);
            $image_type = $image_type_aux[1];
            $image_base64 = base64_decode($image_parts[1]);

            // Generate unique filename
            $filename = uniqid() . '.' . $image_type;
            $filepath = 'profiles/' . $filename;

            // Store image
            $stored = Storage::disk('s3')->put($filepath, $image_base64, 'public');

            if ($stored) {
                $data['profile'] = $filepath;
            } else {
                // Log error if storage fails
                \Log::error('Failed to store profile image for user ' . $user->id);
                unset($data['profile']); // Don't update profile if storage failed
            }
        } elseif (isset($data['profile']) && $data['profile'] === null) {
            // If profile is explicitly set to null, remove the existing image
            if ($user->profile && Storage::disk('s3')->exists($user->profile)) {
                Storage::disk('s3')->delete($user->profile);
            }
            $data['profile'] = null;
        }

        $user->fill($data);
        $user->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
