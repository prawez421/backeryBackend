
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_items', function (Blueprint $table) {

            $table->id();

            // Purchase Relationship
            $table->foreignId('purchase_id')
                ->constrained('purchases')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            // Product Relationship
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            // Product Details
            $table->decimal('quantity', 12, 3)->default(0);

            // Price Details
            $table->decimal('purchase_price', 12, 2)->default(0);
            $table->decimal('mrp', 12, 2)->default(0);
            $table->decimal('selling_price', 12, 2)->default(0);

            // Discount and Tax
            $table->decimal('discount', 12, 2)->default(0);

            $table->decimal('tax', 12, 2)->default(0);

            // Total Amount
            $table->decimal('total_amount', 12, 2)->default(0);

            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_items');
    }
};
