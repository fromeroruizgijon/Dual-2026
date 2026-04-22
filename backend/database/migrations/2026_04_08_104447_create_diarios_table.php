<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('alimento_id'); 
            $table->string('nombre');
            $table->string('marca')->nullable();
            $table->string('imagen')->nullable();
            $table->integer('cantidad'); // gramos o ml
            $table->float('calorias');
            $table->float('proteinas');
            $table->float('carbohidratos');
            $table->float('grasas');
            $table->string('tipo_comida'); 
            $table->date('fecha'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diarios');
    }
};
