import { Component } from '@angular/core';
import { Alimento } from '../../models/alimento.model';
import { ComidaService } from '../../services/comida.service';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {
  termino: string = '';           // Lo que escribe el usuario
  resultados: Alimento[] = [];    // Donde guardaremos lo que devuelva la API
  cargando: boolean = false;      // Para mostrar un spinner mientras busca
  alimentoSeleccionado: Alimento | null = null;

  constructor(private comidaService: ComidaService) {}

  buscar() {
    if (this.termino.trim().length === 0) return;

    this.cargando = true;
    this.comidaService.buscarAlimentos(this.termino).subscribe({
      next: (data) => {
        this.resultados = data;
        this.cargando = false;
        console.log('Datos recibidos:', this.resultados);
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        this.cargando = false;
      }
    });
  }
  verDetalles(alimento: Alimento) {
    this.alimentoSeleccionado = alimento;
    // Aquí dispararemos el modal de Bootstrap después
  }
  aniadirAlDiario() {
    if (!this.alimentoSeleccionado || !this.alimentoSeleccionado.cantidadSeleccionada) {
      alert('Por favor, introduce una cantidad válida');
      return;
    }
    // Por ahora, como no tenemos Laravel listo, lo guardaremos en el LocalStorage
    // para que no se pierda al recargar.
    const diarioActual = JSON.parse(localStorage.getItem('diario') || '[]');
    
    // Calculamos los valores reales basados en la cantidad elegida
    const factor = this.alimentoSeleccionado.cantidadSeleccionada / 100;
    
    const nuevoRegistro = {
      ...this.alimentoSeleccionado,
      caloriasTotales: this.alimentoSeleccionado.calorias * factor,
      fecha: new Date().toLocaleDateString()
    };

    diarioActual.push(nuevoRegistro);
    localStorage.getItem('diario');
    localStorage.setItem('diario', JSON.stringify(diarioActual));

    alert(`${this.alimentoSeleccionado.nombre} añadido al diario correctamente`);
    this.alimentoSeleccionado = null; // Cerramos el modal
    }
}
