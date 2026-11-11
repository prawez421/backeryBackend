
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {

            $table->id();

            // Unique Unit ID
            $table->string('unique_id', 50)->unique();

            // Branch Code
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Unit Information
            $table->string('unit_name', 100);
            $table->string('short_name', 20);

            // Status
            $table->enum('status', [
                'Active',
                'Inactive',
            ])->default('Active');

            $table->timestamps();

            // Branch-wise Unique Short Name
            $table->unique(
                ['branch_code', 'short_name'],
                'branch_unit_short_name_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
