<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DiarioController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
// Ruta para guardar un alimento
Route::post('/diario', [DiarioController::class, 'store']);

// Ruta para obtener el diario de un día específico
Route::get('/diario/{fecha}', [DiarioController::class, 'getPorFecha']);
