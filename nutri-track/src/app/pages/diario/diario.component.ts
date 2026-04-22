import { Component, OnInit } from '@angular/core';
import { DiarioService } from '../../services/diario.service';

@Component({
  selector: 'app-diario',
  standalone: false,
  templateUrl: './diario.component.html',
  styleUrl: './diario.component.scss'
})
export class DiarioComponent implements OnInit {
  registros: any[] = [];
  totales = { calorias: 0, proteinas: 0, carbs: 0, grasas: 0 };
  alimentoDetalle: any = null;

  constructor(private diarioService: DiarioService) {}

  ngOnInit(): void {
    this.cargarDiarioDesdeBackend();
  }

  cargarDiarioDesdeBackend() {
    const hoy = new Date().toISOString().split('T')[0];
    
    this.diarioService.obtenerDiario(hoy).subscribe({
      next: (data) => {
        this.registros = data;
        this.calcularTotales();
      },
      error: (err) => {
        console.error('Error al cargar el diario desde Laravel:', err);
      }
    });
  }

  calcularTotales() {
    this.totales = this.registros.reduce((acc, reg) => {
      // Usamos el campo directo, Laravel ya recibe los macros calculados para esa cantidad
      acc.calorias += Number(reg.calorias) || 0;
      acc.proteinas += Number(reg.proteinas) || 0;
      acc.carbs += Number(reg.carbohidratos) || 0;
      acc.grasas += Number(reg.grasas) || 0;
      
      return acc;
    }, { calorias: 0, proteinas: 0, carbs: 0, grasas: 0 });
  }

  borrarRegistro(index: number) {
    this.registros.splice(index, 1);
    this.calcularTotales();
  }

  verIngredientes(alimento: any) {
    this.alimentoDetalle = alimento;
  }

  cerrarModal() {
    this.alimentoDetalle = null;
  }
}