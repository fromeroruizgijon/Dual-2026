<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diario extends Model
{
    protected $fillable = [
        'user_id', 'alimento_id', 'nombre', 'marca', 'imagen', 
        'cantidad', 'calorias', 'proteinas', 'carbohidratos', 
        'grasas', 'tipo_comida', 'fecha'
    ];
}
