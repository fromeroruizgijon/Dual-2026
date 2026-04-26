<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DiarioController;
use App\Http\Controllers\Api\AuthController;

// --- RUTAS PÚBLICAS ---
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// --- RUTAS PROTEGIDAS (requieren token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {

    // Datos del usuario autenticado
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Actualizar nombre y email del perfil
    Route::put('/user/perfil', function (Request $request) {
        $validated = $request->validate([
            'name'  => 'required|string|min:3',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
        ]);
        $request->user()->update($validated);
        return response()->json($request->user());
    });

    // Cerrar sesión: invalida el token en el servidor
    Route::post('/logout', [AuthController::class, 'logout']);

    // --- RUTAS DEL DIARIO ---
    // IMPORTANTE: la ruta específica /estadisticas/{dias} debe ir ANTES que /diario/{fecha}
    // para que Laravel no interprete "estadisticas" como una fecha
    Route::get('/diario/estadisticas/{dias}', [DiarioController::class, 'getEstadisticas']);
    Route::post('/diario', [DiarioController::class, 'store']);
    Route::get('/diario/{fecha}', [DiarioController::class, 'getPorFecha']);
    Route::put('/diario/{id}', [DiarioController::class, 'update']);
    Route::delete('/diario/{id}', [DiarioController::class, 'destroy']);

    // --- RUTAS DE ADMINISTRACIÓN ---
    // Solo accesibles si el usuario tiene is_admin = true en base de datos
    Route::get('/admin/usuarios', function (Request $request) {
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }
        return \App\Models\User::orderBy('created_at', 'desc')->get();
    });

    Route::delete('/admin/usuarios/{id}', function (Request $request, $id) {
        if (!$request->user()->is_admin) {
            return response()->json(['message' => 'Acceso denegado'], 403);
        }
        $usuario = \App\Models\User::find($id);
        if (!$usuario) {
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }
        $usuario->delete();
        return response()->json(['message' => 'Usuario eliminado correctamente']);
    });

});
