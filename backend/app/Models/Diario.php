<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diario extends Model
{
    protected $fillable = [
        'user_id', 'nombre', 'marca', 'calorias', 'proteinas', 
        'carbohidratos', 'grasas', 'cantidadSeleccionada', 'imagen',
        'ingredientesTexto', 'alergenosTags' // <-- AÑADIDOS
    ];
}
