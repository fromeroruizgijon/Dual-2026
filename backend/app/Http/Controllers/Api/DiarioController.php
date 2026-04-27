<?php

namespace App\Http\Controllers\Api;

class DiarioController extends \App\Http\Controllers\Controller
{
    public function store(\Illuminate\Http\Request $request)
    {
        $validated = $request->validate([
            'alimento_id' => 'required|string',
            'nombre' => 'required|string',
            'marca' => 'nullable|string',
            'imagen' => 'nullable|string',
            'cantidad' => 'required|numeric',
            'calorias' => 'required|numeric',
            'proteinas' => 'required|numeric',
            'carbohidratos' => 'required|numeric',
            'grasas' => 'required|numeric',
            'tipo_comida' => 'required|string',
            'fecha' => 'required|date',
        ]);

        $validated['user_id'] = $request->user()->id;

        $registro = \App\Models\Diario::create($validated);
        return response()->json($registro, 201);
    }

    public function getPorFecha($fecha, \Illuminate\Http\Request $request)
    {
        $registros = \App\Models\Diario::where('user_id', $request->user()->id)
            ->where('fecha', $fecha)
            ->get();

        return response()->json($registros);
    }

    public function update(\Illuminate\Http\Request $request, $id) {
        $registro = \App\Models\Diario::where('user_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'cantidad' => 'required|numeric',
            'calorias' => 'required|numeric',
            'proteinas' => 'required|numeric',
            'carbohidratos' => 'required|numeric',
            'grasas' => 'required|numeric',
        ]);

        $registro->update($validated);
        return response()->json($registro);
    }

    public function destroy(\Illuminate\Http\Request $request, $id) {
        $registro = \App\Models\Diario::where('user_id', $request->user()->id)->findOrFail($id);
        $registro->delete();
        return response()->json(['message' => 'Eliminado correctamente']);
    }

    public function getEstadisticas(\Illuminate\Http\Request $request, $dias) {
        $fechaInicio = now()->subDays($dias)->format('Y-m-d');

        // agrupa por fecha y suma calorías de cada día
        $registros = \App\Models\Diario::where('user_id', $request->user()->id)
            ->where('fecha', '>=', $fechaInicio)
            ->orderBy('fecha', 'asc')
            ->get()
            ->groupBy('fecha');

        $estadisticas = [];
        foreach ($registros as $fecha => $items) {
            $estadisticas[] = [
                'fecha' => $fecha,
                'calorias' => $items->sum('calorias'),
            ];
        }

        return response()->json($estadisticas);
    }
}
