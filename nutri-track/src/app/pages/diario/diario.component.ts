import { Component } from '@angular/core';

@Component({
  selector: 'app-diario',
  standalone: false,
  templateUrl: './diario.component.html',
  styleUrl: './diario.component.scss'
})
export class DiarioComponent {
  registros: any[] = [];
  totales = { calorias: 0, proteinas: 0, carbs: 0, grasas: 0 };

  ngOnInit(): void {
    this.cargarDiario();
  }

  cargarDiario() {
    this.registros = JSON.parse(localStorage.getItem('diario') || '[]');
    this.calcularTotales();
  }

  calcularTotales() {
    this.totales = this.registros.reduce((acc, reg) => {
      const factor = reg.cantidadSeleccionada / 100;
      acc.calorias += reg.calorias * factor;
      acc.proteinas += reg.proteinas * factor;
      acc.carbs += reg.carbohydrates || reg.carbohidratos * factor;
      acc.grasas += reg.grasas * factor;
      return acc;
    }, { calorias: 0, proteinas: 0, carbs: 0, grasas: 0 });
  }

  borrarRegistro(index: number) {
    this.registros.splice(index, 1);
    localStorage.setItem('diario', JSON.stringify(this.registros));
    this.calcularTotales();
  }
  // Variable para guardar el alimento que vamos a mostrar en el modal
  alimentoDetalle: any = null;

  // Función que se ejecuta al hacer clic en un alimento del diario
  verIngredientes(alimento: any) {
    this.alimentoDetalle = alimento;
  }

  cerrarModal() {
    this.alimentoDetalle = null;
  }
}
