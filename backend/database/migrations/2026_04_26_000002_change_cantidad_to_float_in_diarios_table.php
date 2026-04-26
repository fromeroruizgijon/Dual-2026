<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('diarios', function (Blueprint $table) {
            // Corregido: antes era integer, lo que truncaba valores como 250.5g
            $table->float('cantidad')->change();
        });
    }

    public function down(): void
    {
        Schema::table('diarios', function (Blueprint $table) {
            $table->integer('cantidad')->change();
        });
    }
};
