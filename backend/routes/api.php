<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DiarioController;
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user/perfil', function (Request $request) {
        $validated = $request->validate([
            'name'  => 'required|string|min:3',
            'email' => 'required|email|unique:users,email,' . $request->user()->id,
        ]);
        $request->user()->update($validated);
        return response()->json($request->user());
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // estadisticas debe ir antes que {fecha} para que Laravel no interprete la palabra como fecha
    Route::get('/diario/estadisticas/{dias}', [DiarioController::class, 'getEstadisticas']);
    Route::post('/diario', [DiarioController::class, 'store']);
    Route::get('/diario/{fecha}', [DiarioController::class, 'getPorFecha']);
    Route::put('/diario/{id}', [DiarioController::class, 'update']);
    Route::delete('/diario/{id}', [DiarioController::class, 'destroy']);

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
