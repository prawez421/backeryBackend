
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchases', function (Blueprint $table) {

            $table->id();

            // Unique Purchase ID
            $table->string('unique_id', 50)->unique();

            // Branch Relationship
            $table->string('branch_code', 50);

            $table->foreign('branch_code')
                ->references('branch_code')
                ->on('branches')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Vendor Relationship
            $table->foreignId('vendor_id')
                ->constrained('vendors')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Purchase Details
            $table->string('invoice_number', 100);
            $table->date('purchase_date');

            // Amount Details
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->decimal('tax', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2)->default(0);

            // Payment Details
            $table->decimal('paid_amount', 12, 2)->default(0);
            $table->decimal('due_amount', 12, 2)->default(0);

            $table->enum('payment_status', [
                'Paid',
                'Partial',
                'Unpaid'
            ])->default('Unpaid');

            // Purchase Status
            $table->string('status', 50)->default('Received');

            // Remarks
            $table->text('remarks')->nullable();

            $table->timestamps();

            // Branch-wise Invoice
            $table->unique(
                ['branch_code', 'invoice_number'],
                'branch_purchase_invoice_unique'
            );

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
