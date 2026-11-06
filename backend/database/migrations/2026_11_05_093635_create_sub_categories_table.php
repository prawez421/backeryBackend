
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();

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

            // Same category mein duplicate sub category nahi hogi
            $table->unique(
                ['category_id', 'sub_category_name'],
                'sub_categories_category_name_unique'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_categories');
    }
};
