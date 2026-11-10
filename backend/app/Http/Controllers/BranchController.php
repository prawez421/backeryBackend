<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;

class BranchController extends Controller
{
    // =====================================
    // GET ALL BRANCHES + STATISTICS
    // =====================================

    public function index(Request $request)
    {
        // Statistics
        $totalBranches = Branch::count();

        $activeBranches = Branch::where('status', 'Active')->count();

        $inactiveBranches = Branch::where('status', 'Inactive')->count();

        // Branch Search
        $query = Branch::query();

        if ($request->filled('search')) {

            $search = trim($request->search);

            $query->where(function ($q) use ($search) {

                $q->where('branch_name', 'like', "%{$search}%")
                    ->orWhere('branch_code', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('state', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");

            });
        }

        // Status Filter
        if ($request->filled('status')) {

            $query->where('status', $request->status);
        }

        // Pagination
        $perPage = (int) $request->input('per_page', 10);

        $perPage = min(max($perPage, 1), 100);

        $branches = $query->latest()->paginate($perPage);

        return response()->json([

            'success' => true,

            'message' => 'Branch list fetched successfully.',

            'statistics' => [
                'total_branches' => $totalBranches,
                'active_branches' => $activeBranches,
                'inactive_branches' => $inactiveBranches,
            ],

            'branches' => $branches->items(),

            'pagination' => [
                'current_page' => $branches->currentPage(),
                'per_page' => $branches->perPage(),
                'total_items' => $branches->total(),
                'total_pages' => $branches->lastPage(),
            ],

        ], 200);
    }


    // =====================================
    // CREATE BRANCH
    // =====================================

    public function store(Request $request)
    {
        $validated = $request->validate([

            'branch_name' => [
                'required',
                'string',
                'max:150',
            ],

            'branch_code' => [
                'required',
                'string',
                'max:50',
                'unique:branches,branch_code',
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'city' => [
                'nullable',
                'string',
                'max:100',
            ],

            'state' => [
                'nullable',
                'string',
                'max:100',
            ],

            'pincode' => [
                'nullable',
                'string',
                'digits:6',
            ],

            'phone' => [
                'nullable',
                'string',
                'digits:10',
            ],

            'email' => [
                'nullable',
                'email',
                'max:150',
            ],

            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],

        ]);

        $branch = Branch::create($validated);

        return response()->json([

            'success' => true,

            'message' => 'Branch created successfully.',

            'data' => $branch,

        ], 201);
    }


    // =====================================
    // GET SINGLE BRANCH
    // =====================================

    public function show(string $id)
    {
        $branch = Branch::withCount([
            'users',
            'vendors',
        ])->find($id);

        if (!$branch) {

            return response()->json([
                'success' => false,
                'message' => 'Branch not found.',
            ], 404);

        }

        return response()->json([

            'success' => true,

            'message' => 'Branch details fetched successfully.',

            'data' => $branch,

        ], 200);
    }


    // =====================================
    // UPDATE BRANCH
    // =====================================

    public function update(Request $request, string $id)
    {
        $branch = Branch::find($id);

        if (!$branch) {

            return response()->json([
                'success' => false,
                'message' => 'Branch not found.',
            ], 404);

        }

        $validated = $request->validate([

            'branch_name' => [
                'required',
                'string',
                'max:150',
            ],

            'branch_code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('branches', 'branch_code')
                    ->ignore($branch->id),
            ],

            'address' => [
                'nullable',
                'string',
            ],

            'city' => [
                'nullable',
                'string',
                'max:100',
            ],

            'state' => [
                'nullable',
                'string',
                'max:100',
            ],

            'pincode' => [
                'nullable',
                'string',
                'digits:6',
            ],

            'phone' => [
                'nullable',
                'string',
                'digits:10',
            ],

            'email' => [
                'nullable',
                'email',
                'max:150',
            ],

            'status' => [
                'required',
                Rule::in(['Active', 'Inactive']),
            ],

        ]);

        $branch->update($validated);

        return response()->json([

            'success' => true,

            'message' => 'Branch updated successfully.',

            'data' => $branch->fresh(),

        ], 200);
    }


    // =====================================
    // DELETE BRANCH
    // =====================================

    public function destroy(string $id)
    {
        $branch = Branch::find($id);

        if (!$branch) {

            return response()->json([
                'success' => false,
                'message' => 'Branch not found.',
            ], 404);

        }

        // Check assigned users
        if ($branch->users()->exists()) {

            return response()->json([
                'success' => false,
                'message' => 'Cannot delete branch because users are assigned to it.',
            ], 409);

        }

        // Check assigned vendors
        if ($branch->vendors()->exists()) {

            return response()->json([
                'success' => false,
                'message' => 'Cannot delete branch because vendors are assigned to it.',
            ], 409);

        }

        try {

            $branch->delete();

            return response()->json([

                'success' => true,

                'message' => 'Branch deleted successfully.',

            ], 200);

        } catch (QueryException $e) {

            return response()->json([

                'success' => false,

                'message' => 'Cannot delete branch because related records exist.',

            ], 409);

        }
    }
}
