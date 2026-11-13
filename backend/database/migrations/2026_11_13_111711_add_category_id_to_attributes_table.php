<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attributes', function (Blueprint $table) {

            // Category Relationship
            $table->foreignId('category_id')
                ->nullable()
                ->after('branch_code')
                ->constrained('categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

        });
    }

    public function down(): void
    {
        Schema::table('attributes', function (Blueprint $table) {

            $table->dropForeign(['category_id']);

            $table->dropColumn('category_id');

        });
    }
};
