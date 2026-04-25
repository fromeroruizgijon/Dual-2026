<?php

namespace App\Http\Controllers\Api;

class DiarioController extends \App\Http\Controllers\Controller
{
    public function store(\Illuminate\Http\Request $request)
    {
        // Validamos TODOS los campos que nos envía Angular
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

        // Laravel detecta al usuario por el token de autenticación:
        $validated['user_id'] = $request->user()->id; 

        $registro = \App\Models\Diario::create($validated);
        return response()->json($registro, 201);
    }

    public function getPorFecha($fecha, \Illuminate\Http\Request $request)
    {
        // OJO: He cambiado el "1" duro por el ID del usuario real para que te funcione a futuro
        $registros = \App\Models\Diario::where('user_id', $request->user()->id)
            ->where('fecha', $fecha)
            ->get();

        return response()->json($registros);
    }
        // Actualizar gramos (PUT)
    // Actualizar gramos (PUT)
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
    // Borrar registro (DELETE)
    public function destroy(\Illuminate\Http\Request $request, $id) {
        $registro = \App\Models\Diario::where('user_id', $request->user()->id)->findOrFail($id);
        $registro->delete();
        
        return response()->json(['message' => 'Eliminado correctamente']);
    }
    // Obtener estadísticas de los últimos X días
    public function getEstadisticas(\Illuminate\Http\Request $request, $dias) {
        // Calculamos la fecha de hace X días
        $fechaInicio = now()->subDays($dias)->format('Y-m-d');
        
        // Buscamos todos los registros desde esa fecha hasta hoy
        $registros = \App\Models\Diario::where('user_id', $request->user()->id)
            ->where('fecha', '>=', $fechaInicio)
            ->orderBy('fecha', 'asc')
            ->get()
            ->groupBy('fecha');

        $estadisticas = [];
        
        // Sumamos las calorías por cada día
        foreach ($registros as $fecha => $items) {
            $estadisticas[] = [
                'fecha' => $fecha,
                'calorias' => $items->sum('calorias'),
            ];
        }

        return response()->json($estadisticas);
    }
}
