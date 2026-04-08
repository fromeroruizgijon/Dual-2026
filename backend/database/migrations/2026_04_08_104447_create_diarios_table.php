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
        Schema::create('diarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con usuario
            $table->string('alimento_id'); // ID de la API (code)
            $table->string('nombre');
            $table->string('marca')->nullable();
            $table->string('imagen')->nullable();
            $table->integer('cantidad'); // gramos o ml
            $table->float('calorias');
            $table->float('proteinas');
            $table->float('carbohidratos');
            $table->float('grasas');
            $table->string('tipo_comida'); // Desayuno, Comida, etc.
            $table->date('fecha'); // La clave para las estadísticas por mes/año
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diarios');
    }
};
