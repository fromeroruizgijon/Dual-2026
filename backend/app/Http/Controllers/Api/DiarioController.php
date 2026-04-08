<?php

namespace App\Http\Controllers\Api;

class DiarioController extends \App\Http\Controllers\Controller
{
    /**
     * Guarda un nuevo alimento en el diario.
     */
    public function store(\Illuminate\Http\Request $request)
    {
        // 1. Validamos que los datos que vienen de Angular sean correctos
        $validated = $request->validate([
            'alimento_id'     => 'required|string',
            'nombre'          => 'required|string',
            'marca'           => 'nullable|string',
            'imagen'          => 'nullable|string',
            'cantidad'        => 'required|numeric',
            'calorias'        => 'required|numeric',
            'proteinas'       => 'required|numeric',
            'carbohidratos'   => 'required|numeric',
            'grasas'          => 'required|numeric',
            'tipo_comida'     => 'required|string',
            'fecha'           => 'required|date',
        ]);

        // 2. Por ahora, como no tenemos login aún, usaremos el usuario 1 por defecto
        // (Asegúrate de tener al menos un usuario en la tabla 'users')
        $validated['user_id'] = 1;

        // 3. Creamos el registro en la base de datos
        $registro = \App\Models\Diario::create($validated);

        return response()->json([
            'message' => 'Alimento registrado correctamente',
            'data' => $registro
        ], 201);
    }

    /**
     * Obtiene los alimentos de un día concreto.
     */
    public function getPorFecha($fecha)
    {
        $registros = \App\Models\Diario::where('user_id', 1)
            ->where('fecha', $fecha)
            ->get();

        return response()->json($registros);
    }
}
