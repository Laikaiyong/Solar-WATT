<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ConstructorProject;
use App\Models\Delivery;
use App\Models\Feedbacks;
use App\Models\Order;
use App\Models\Quotation;
use App\Models\SolarConstructionSite;
use App\Models\SolarProductService;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Dashboard', [
                'userRole' => $user->role,
                'users' => $this->getUsers(),
                'orders' => $this->getOrders(),
                'products' => $this->getProducts(),
                'projects' => $this->getProjects(),
                'quotations' => $this->getQuotations(),
                'feedbacks' => $this->getFeedbacks(),
                'deliveries' => $this->getDeliveries(),
        ]);
    }

    private function getAllData()
    {
        return [
            'users' => $this->getUsers(),
            'orders' => $this->getOrders(),
            'products' => $this->getProducts(),
            'projects' => $this->getProjects(),
            'quotations' => $this->getQuotations(),
            'feedbacks' => $this->getFeedbacks(),
            'deliveries' => $this->getDeliveries(),
        ];
    }

    private function getUsers()
    {
        return [
            'total' => User::count(),
            'customers' => User::where('role', 'customer')->count(),
            'companies' => User::where('role', 'company')->count(),
            'deliveries' => User::where('role', 'delivery')->count(),
            'constructors' => User::where('role', 'constructor')->count(),
            'recent' => User::latest()->take(5)->get(),
        ];
    }

    private function getOrders()
    {
        return [
            'total' => Order::count(),
            'pending' => Order::where('status', 'Pending')->count(),
            'completed' => Order::where('status', 'Completed')->count(),
            'cancelled' => Order::where('status', 'Cancelled')->count(),
            'recent' => Order::with('user')->latest()->take(5)->get(),
        ];
    }

    private function getProducts()
    {
        return [
            'total' => SolarProductService::count(),
            'products' => SolarProductService::where('type', 'Product')->count(),
            'services' => SolarProductService::where('type', 'Service')->count(),
            'recent' => SolarProductService::latest()->take(5)->get(),
        ];
    }

    private function getProjects()
    {
        return [
            'total' => ConstructorProject::count(),
            'pending' => ConstructorProject::where('status', 'pending')->count(),
            'inProgress' => ConstructorProject::where('status', 'in_progress')->count(),
            'completed' => ConstructorProject::where('status', 'completed')->count(),
            'recent' => ConstructorProject::latest()->take(5)->get(),
        ];
    }

    private function getQuotations()
    {
        return [
            'total' => Quotation::count(),
            'recent' => Quotation::with('constructor')->latest()->take(5)->get(),
        ];
    }

    private function getFeedbacks()
    {
        return [
            'total' => Feedbacks::count(),
            'recent' => Feedbacks::with('user')->latest()->take(5)->get(),
        ];
    }

    private function getDeliveries()
    {
        return [
            'total' => Delivery::count(),
            'initiated' => Delivery::where('status', 'Initiated')->count(),
            'delivering' => Delivery::where('status', 'Delivering')->count(),
            'delivered' => Delivery::where('status', 'Completed')->count(),
            'recent' => Delivery::with('order')->latest()->take(5)->get(),
        ];
    }
}
