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
        Schema::table('diarios', function (Blueprint $table) {
            // text permite guardar párrafos largos, string solo 255 caracteres
            $table->text('ingredientesTexto')->nullable();
            $table->text('alergenosTags')->nullable(); // Para guardar los alérgenos también
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('diarios', function (Blueprint $table) {
            $table->dropColumn(['ingredientesTexto', 'alergenosTags']);
        });
    }
};
