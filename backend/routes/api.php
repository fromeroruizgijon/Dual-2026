<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DiarioController;
use App\Http\Controllers\Api\AuthController;

// --- RUTAS PÚBLICAS ---
// Cualquiera puede registrarse o loguearse
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --- RUTAS PROTEGIDAS (Necesitan Token) ---
Route::middleware('auth:sanctum')->group(function () {
    
    // Ruta para ver los datos del usuario logueado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Rutas del Diario (Solo el dueño del token puede usarlas)
    Route::post('/diario', [DiarioController::class, 'store']);
    Route::get('/diario/{fecha}', [DiarioController::class, 'getPorFecha']);
    Route::put('/diario/{id}', [\App\Http\Controllers\Api\DiarioController::class, 'update']);
    Route::delete('/diario/{id}', [\App\Http\Controllers\Api\DiarioController::class, 'destroy']);

    Route::get('/diario/estadisticas/{dias}', [\App\Http\Controllers\Api\DiarioController::class, 'getEstadisticas']);
    
});
