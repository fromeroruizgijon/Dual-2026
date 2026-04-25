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
  
  // Variables para la edición
  registroEditando: any = null;
  nuevaCantidad: number = 0;

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
      acc.calorias += Number(reg.calorias) || 0;
      acc.proteinas += Number(reg.proteinas) || 0;
      acc.carbs += Number(reg.carbohidratos) || 0;
      acc.grasas += Number(reg.grasas) || 0;
      return acc;
    }, { calorias: 0, proteinas: 0, carbs: 0, grasas: 0 });
  }

  borrarRegistro(index: number, id: number) {
    if(confirm('¿Estás seguro de que quieres eliminar este plato?')) {
      this.diarioService.eliminarAlimento(id).subscribe({
        next: () => {
          this.registros.splice(index, 1);
          this.calcularTotales();
        },
        error: (err) => alert('Error al borrar en Laravel')
      });
    }
  }

  // --- Lógica de Edición ---
  abrirModalEdicion(registro: any) {
    // Clonamos el objeto para no modificar la vista hasta que se guarde
    this.registroEditando = { ...registro };
    this.nuevaCantidad = registro.cantidad;
  }

  cerrarModal() {
    this.registroEditando = null;
  }

  guardarEdicion() {
    if (this.nuevaCantidad <= 0) return;

    // 1. Necesitamos calcular los "macros base" (por gramo) para recalculalos
    const factorAntiguo = this.registroEditando.cantidad;
    const caloriasBase = this.registroEditando.calorias / factorAntiguo;
    const proteinasBase = this.registroEditando.proteinas / factorAntiguo;
    const carbohidratosBase = this.registroEditando.carbohidratos / factorAntiguo;
    const grasasBase = this.registroEditando.grasas / factorAntiguo;

    // 2. Calculamos los nuevos valores
    const datosActualizados = {
      cantidad: this.nuevaCantidad,
      calorias: caloriasBase * this.nuevaCantidad,
      proteinas: proteinasBase * this.nuevaCantidad,
      carbohidratos: carbohidratosBase * this.nuevaCantidad,
      grasas: grasasBase * this.nuevaCantidad
    };

    // 3. Enviamos a Laravel
    this.diarioService.actualizarAlimento(this.registroEditando.id, datosActualizados).subscribe({
      next: (dataDesdeLaravel) => {
        // Actualizamos la fila en la tabla con los datos que devuelve Laravel
        const index = this.registros.findIndex(r => r.id === this.registroEditando.id);
        if (index !== -1) {
          this.registros[index] = dataDesdeLaravel;
        }
        this.calcularTotales();
        this.cerrarModal();
      },
      error: () => alert('Error al actualizar')
    });
  }
}