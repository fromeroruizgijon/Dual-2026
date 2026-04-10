<?php

namespace App\Http\Controllers\Api;

class DiarioController extends \App\Http\Controllers\Controller
{
    /**
     * Guarda un nuevo alimento en el diario.
     */
    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'marca' => 'nullable|string',
            'calorias' => 'required|numeric',
            'proteinas' => 'required|numeric',
            'carbohidratos' => 'required|numeric',
            'grasas' => 'required|numeric',
            'cantidadSeleccionada' => 'required|numeric',
            'imagen' => 'nullable|string',
        ]);

        // YA NO USAMOS EL 1 FIJO. Laravel detecta al usuario por el token:
        $validated['user_id'] = $request->user()->id; 

        $registro = \App\Models\Diario::create($validated);
        return response()->json($registro, 201);
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
