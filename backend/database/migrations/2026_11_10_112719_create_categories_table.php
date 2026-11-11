
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {

            $table->id();

            // Unique Category ID
            $table->string('unique_id', 50)->unique();

            // Branch Code
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Category Information
            $table->string('category_name', 150);

            // Status
            $table->enum('status', [
                'Active',
                'Inactive',
            ])->default('Active');

            $table->timestamps();

            // Same category allowed in different branches
            $table->unique(
                ['branch_code', 'category_name'],
                'branch_category_name_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
