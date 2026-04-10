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
    // Obtenemos la fecha de hoy en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];
    
    this.diarioService.obtenerDiario(hoy).subscribe({
      next: (data) => {
        this.registros = data;
        
        // Procesamos los datos que vienen de la DB
        this.registros.forEach(reg => {
          // Convertimos los alérgenos de texto plano a Array de nuevo
          if (reg.alergenosTags && typeof reg.alergenosTags === 'string') {
            try {
              reg.alergenosTags = JSON.parse(reg.alergenosTags);
            } catch (e) {
              reg.alergenosTags = [];
            }
          }
        });

        this.calcularTotales();
      },
      error: (err) => {
        console.error('Error al cargar el diario desde Laravel:', err);
      }
    });
  }

  calcularTotales() {
    this.totales = this.registros.reduce((acc, reg) => {
      // Usamos los nombres exactos de tu base de datos
      const factor = (reg.cantidadSeleccionada || 0) / 100;
      
      acc.calorias += (reg.calorias || 0) * factor;
      acc.proteinas += (reg.proteinas || 0) * factor;
      acc.carbs += (reg.carbohidratos || 0) * factor;
      acc.grasas += (reg.grasas || 0) * factor;
      
      return acc;
    }, { calorias: 0, proteinas: 0, carbs: 0, grasas: 0 });
  }

  // Para borrar, ahora deberíamos llamar a la API (lo haremos en el siguiente paso)
  borrarRegistro(index: number) {
    // Por ahora lo quitamos visualmente, pero faltaría el DELETE en Laravel
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