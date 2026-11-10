
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
            $table->foreignId('branch_id')
                ->constrained('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Category Relationship
            $table->foreignId('category_id')
                ->constrained('categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Brand Details
            $table->string('brand_name', 150);

            $table->text('description')->nullable();

            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();

            // Same brand name allowed in different categories
            $table->unique(
                ['branch_id', 'category_id', 'brand_name'],
                'branch_category_brand_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brands');
    }
};
