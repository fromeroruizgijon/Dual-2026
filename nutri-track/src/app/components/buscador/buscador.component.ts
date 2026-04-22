import { Component } from '@angular/core';
import { Alimento } from '../../models/alimento.model';
import { ComidaService } from '../../services/comida.service';
import { DiarioService } from '../../services/diario.service';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {
  resultados: Alimento[] = [];    
  cargando: boolean = false;      
  cargandoDetalles: boolean = false;
  alimentoSeleccionado: Alimento | null = null;
  categoriaActiva: string = '';

  // Menú de ingredientes: Español para el usuario, Inglés para la API
  ingredientesPrincipales = [
    { nombre: 'Pollo', busqueda: 'chicken_breast', icono: '🍗' },
    { nombre: 'Salmón', busqueda: 'salmon', icono: '🍣' },
    { nombre: 'Huevo', busqueda: 'egg', icono: '🥚' },
    { nombre: 'Cerdo', busqueda: 'pork', icono: '🥓' },
    { nombre: 'Aguacate', busqueda: 'avocado', icono: '🥑' },
    { nombre: 'Ajo', busqueda: 'garlic', icono: '🧄' }
  ];

  constructor(
    private comidaService: ComidaService,
    private diarioService: DiarioService
  ) {}

  buscarCategoria(ingrediente: string) {
    this.cargando = true;
    this.resultados = [];
    this.categoriaActiva = ingrediente;

    this.comidaService.buscarPorIngrediente(ingrediente).subscribe(data => {
      this.resultados = data;
      this.cargando = false;
    });
  }

  verDetalles(alimento: Alimento) {
    this.cargandoDetalles = true;
    if(alimento.id) {
        this.comidaService.obtenerDetalles(alimento.id).subscribe(detalle => {
          if (detalle) {
            this.alimentoSeleccionado = detalle;
          }
          this.cargandoDetalles = false;
        });
    }
  }

  aniadirAlDiario() {
    if (!this.alimentoSeleccionado?.cantidadSeleccionada) {
      alert('Por favor, introduce los gramos');
      return;
    }

    // Calculamos los macros reales según los gramos introducidos (Base 100g)
    const factor = this.alimentoSeleccionado.cantidadSeleccionada / 100;

    const registro = {
      alimento_id: this.alimentoSeleccionado.id,
      nombre: this.alimentoSeleccionado.nombre,
      marca: this.alimentoSeleccionado.categoria, // Guardamos la categoría del plato aquí
      imagen: this.alimentoSeleccionado.imagen,
      cantidad: this.alimentoSeleccionado.cantidadSeleccionada,
      calorias: this.alimentoSeleccionado.calorias * factor,
      proteinas: this.alimentoSeleccionado.proteinas * factor,
      carbohidratos: this.alimentoSeleccionado.carbohidratos * factor,
      grasas: this.alimentoSeleccionado.grasas * factor,
      tipo_comida: 'Comida', // Valor por defecto
      fecha: new Date().toISOString().split('T')[0] // Se guarda con la fecha de hoy YYYY-MM-DD
    };

    this.diarioService.guardarAlimento(registro).subscribe({
      next: () => { 
        alert('¡Añadido a tu diario con éxito!'); 
        this.alimentoSeleccionado = null; 
      },
      error: () => alert('Error de conexión con Laravel')
    });
  }
}