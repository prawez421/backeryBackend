
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {

            $table->id();

            // Unique Product ID
            $table->string('unique_id', 50)->unique();

            // Branch Relationship
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Product Details
            $table->string('product_name', 150);

            // Category Relationship
            $table->foreignId('category_id')
                ->constrained('categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Sub Category Relationship
            $table->foreignId('sub_category_id')
                ->constrained('sub_categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Brand Relationship
            $table->foreignId('brand_id')
                ->constrained('brands')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Unit Relationship
            $table->foreignId('unit_id')
                ->constrained('units')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Product Image
            $table->string('product_image')->nullable();

            // Multiple Product Images
            $table->json('product_images')->nullable();

            // Description
            $table->text('description')->nullable();

            // Status
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();

            // Branch-wise Product Name
            $table->unique(
                ['branch_code', 'product_name'],
                'branch_product_name_unique'
            );

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
