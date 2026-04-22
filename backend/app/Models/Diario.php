<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diario extends Model
{
    use HasFactory;

    // Estos son los campos que Laravel TIENE PERMISO para guardar
    protected $fillable = [
        'user_id',
        'alimento_id',
        'nombre',
        'marca',
        'imagen',
        'cantidad',
        'calorias',
        'proteinas',
        'carbohidratos',
        'grasas',
        'tipo_comida',
        'fecha',
    ];
}
