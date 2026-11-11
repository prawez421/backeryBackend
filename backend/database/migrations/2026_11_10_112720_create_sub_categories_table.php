
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sub_categories', function (Blueprint $table) {

            $table->id();

            // Unique Sub Category ID
            $table->string('unique_id', 50)->unique();

            // Branch Code
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Main Category Relation
            $table->foreignId('category_id')
                ->constrained('categories')
                ->cascadeOnDelete();

            // Sub Category Name
            $table->string('sub_category_name', 100);

            // Status
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();

            // Same sub-category allowed in different branches
            $table->unique(
                ['branch_code', 'category_id', 'sub_category_name'],
                'branch_category_sub_category_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sub_categories');
    }
};
