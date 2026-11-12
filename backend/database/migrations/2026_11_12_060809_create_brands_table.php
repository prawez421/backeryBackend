
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brands', function (Blueprint $table) {

            $table->id();

            // Unique Brand ID
            $table->string('unique_id', 50)->unique();

            // Branch Relationship
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Category Relationship
            $table->foreignId('category_id')
                ->constrained('categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Brand Details
            $table->string('brand_name', 150);

            // Brand Logo
            $table->string('brand_logo')->nullable();

            // Description
            $table->text('description')->nullable();

            // Status
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();

            // Branch-wise duplicate prevention
            $table->unique(
                ['branch_code', 'brand_name'],
                'branch_brand_name_unique'
            );

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
