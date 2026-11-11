
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

            // Branch Code
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Attribute Name
            $table->string('attribute_name', 150);

            // Status
            $table->enum('status', ['Active', 'Inactive'])
                ->default('Active');

            $table->timestamps();

            // Branch-wise unique attribute name
            $table->unique(
                ['branch_code', 'attribute_name'],
                'branch_attribute_name_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attributes');
    }
};
