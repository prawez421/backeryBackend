
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attributes', function (Blueprint $table) {

            $table->id();

            // Unique Attribute ID
            $table->string('unique_id', 50)->unique();

            // Branch Relationship
            $table->foreignId('branch_id')
                ->constrained('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Attribute Name
            $table->string('attribute_name')->unique();

            // Status
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};
