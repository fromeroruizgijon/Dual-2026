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
    {
      id: 'ninguna', titulo: 'Estándar', icono: 'bi-basket',
      desc: 'Sin restricciones específicas. Todas las recetas son aptas.',
      excluye: [] as string[]
    },
    {
      id: 'vegana', titulo: 'Vegana', icono: 'bi-flower2',
      desc: 'Excluye todos los productos de origen animal.',
      excluye: ['Carne', 'Aves', 'Pescado', 'Huevo', 'Lácteos', 'Miel', 'Gelatina']
    },
    {
      id: 'vegetariana', titulo: 'Vegetariana', icono: 'bi-egg-fried',
      desc: 'Permite lácteos y huevos, pero excluye toda la carne.',
      excluye: ['Carne', 'Aves', 'Pescado', 'Marisco', 'Gelatina']
    },
    {
      id: 'singluten', titulo: 'Sin Gluten', icono: 'bi-slash-circle',
      desc: 'Apto para celíacos o intolerantes al gluten.',
      excluye: ['Trigo', 'Harina', 'Pan', 'Pasta', 'Cebada', 'Seitán', 'Cuscús']
    },
    {
      id: 'sinlactosa', titulo: 'Sin Lactosa', icono: 'bi-cup-hot',
      desc: 'Excluye lácteos y todos sus derivados.',
      excluye: ['Leche', 'Queso', 'Nata', 'Mantequilla', 'Yogur', 'Mozzarella']
    },
    {
      id: 'sinpalma', titulo: 'Sin Aceite de Palma', icono: 'bi-tree',
      desc: 'Productos libres de aceite de palma por salud o ecología.',
      excluye: ['Aceite de palma', 'Palm oil']
    }
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
