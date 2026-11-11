
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();

            // Unique Vendor ID
            $table->string('unique_id', 50)->unique();

            // Vendor Code
            $table->string('vendor_code', 50)->unique();

           // User Branch Code
$table->string('branch_code', 50)->nullable();

$table->foreign('branch_code')
    ->references('branch_code')
    ->on('branches')
    ->cascadeOnUpdate()
    ->restrictOnDelete();

            $table->string('vendor_name', 150);
            $table->string('company_name', 150)->nullable();

            $table->string('category', 100);

            $table->string('contact_person', 150)->nullable();
            $table->string('mobile', 15);
            $table->string('email', 150)->nullable();

            $table->string('gst_number', 20)->nullable();

            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 10)->nullable();

            $table->string('payment_terms', 50)->default('Cash');

            $table->decimal('opening_balance', 12, 2)->default(0);

            $table->string('status', 20)->default('Active');

            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
