<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Aws\Sns\SnsClient; 
use Aws\Exception\AwsException;
use Napp\Xray\Facades\Xray;
use Pkerrigan\Xray\Trace;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        Xray::addSegment('Registration');
        // Trace::getInstance()
        //     ->getCurrentSegment()
        //     ->addSubsegment(
        //         (new SqlSegment())
        //             ->setName('db.example.com')
        //             ->setDatabaseType('PostgreSQL')
        //             ->setQuery($mySanitisedQuery)    // Make sure to remove sensitive data before passing in a query
        //             ->begin()    
        //     );
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone_number' => $request->phone_number,
        ]);

        event(new Registered($user));

        $SnSclient = new SnsClient([
            'region' => 'us-east-1',
            'version' => 'latest',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);
    
        try {
            $result = $SnSclient->publish([
                'Message' => 'Thank you for registering!',
                'PhoneNumber' => $user->phone_number,
            ]);
        } catch (AwsException $e) {
            // return response()->json(['message' => 'Registration successful, but SMS failed to send.'], 201);
        }

        Auth::login($user);

        \Log::info('User registered');
        Xray::endSegment('Registration');

        return redirect(route('dashboard', absolute: false));
    }
}
