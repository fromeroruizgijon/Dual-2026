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
      error: () => {
        alert('No se pudo cargar el diario. Comprueba la conexión con el servidor.');
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
    if (confirm('¿Estás seguro de que quieres eliminar este plato?')) {
      this.diarioService.eliminarAlimento(id).subscribe({
        next: () => {
          this.registros.splice(index, 1);
          this.calcularTotales();
        },
        error: () => alert('Error al borrar el registro')
      });
    }
  }

  abrirModalEdicion(registro: any) {
    // spread para no mutar la fila visible hasta que se confirme el guardado
    this.registroEditando = { ...registro };
    this.nuevaCantidad = registro.cantidad;
  }

  cerrarModal() {
    this.registroEditando = null;
  }

  guardarEdicion() {
    if (this.nuevaCantidad <= 0) return;

    // divide por la cantidad original para obtener el valor por gramo y reescala a la nueva cantidad
    const base = this.registroEditando.cantidad;
    const datosActualizados = {
      cantidad: this.nuevaCantidad,
      calorias: (this.registroEditando.calorias / base) * this.nuevaCantidad,
      proteinas: (this.registroEditando.proteinas / base) * this.nuevaCantidad,
      carbohidratos: (this.registroEditando.carbohidratos / base) * this.nuevaCantidad,
      grasas: (this.registroEditando.grasas / base) * this.nuevaCantidad
    };

    this.diarioService.actualizarAlimento(this.registroEditando.id, datosActualizados).subscribe({
      next: (dataDesdeLaravel) => {
        const index = this.registros.findIndex(r => r.id === this.registroEditando.id);
        if (index !== -1) this.registros[index] = dataDesdeLaravel;
        this.calcularTotales();
        this.cerrarModal();
      },
      error: () => alert('Error al actualizar')
    });
  }
}
