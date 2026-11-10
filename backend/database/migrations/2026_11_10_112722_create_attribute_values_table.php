
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attribute_values', function (Blueprint $table) {

            $table->id();

            // Unique ID
            $table->string('unique_id', 50)->unique();

            // Branch Relationship
            $table->foreignId('branch_id')
                ->constrained('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Attribute Relationship
            $table->foreignId('attribute_id')
                ->constrained('attributes')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Attribute Value
            $table->string('attribute_value', 150);

            // Status
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();

            // Prevent duplicate values within same attribute and branch
            $table->unique(
                ['branch_id', 'attribute_id', 'attribute_value'],
                'attribute_value_unique'
            );

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attribute_values');
    }
};
