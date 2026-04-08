import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dietas',
  standalone: false,
  templateUrl: './dietas.component.html',
  styleUrls: ['./dietas.component.scss']
})
export class DietasComponent implements OnInit {
  
  dietaActual: string = 'ninguna';

  // Lista de dietas disponibles para generar el HTML más limpio
  opcionesDietas = [
    { id: 'ninguna', titulo: 'Estándar', icono: '🍽️', desc: 'Sin restricciones específicas.' },
    { id: 'vegana', titulo: 'Vegana', icono: '🌱', desc: 'Excluye todos los productos de origen animal.' },
    { id: 'vegetariana', titulo: 'Vegetariana', icono: '🥛', desc: 'Permite lácteos y huevos, pero no carne.' },
    { id: 'singluten', titulo: 'Sin Gluten', icono: '🌾', desc: 'Apto para celíacos o intolerantes al gluten.' },
    { id: 'sinlactosa', titulo: 'Sin Lactosa', icono: '🧀', desc: 'Excluye productos con lactosa o derivados lácteos.' },
    { id: 'sinpalma', titulo: 'Sin Aceite de Palma', icono: '🌴', desc: 'Productos libres de aceite de palma por salud o ecología.' }
  ];

  ngOnInit(): void {
    // Al cargar la página, leemos qué dieta tenía guardada
    this.dietaActual = localStorage.getItem('miDieta') || 'ninguna';
  }

  seleccionarDieta(dietaId: string) {
    this.dietaActual = dietaId;
    localStorage.setItem('miDieta', dietaId);
  }
}
