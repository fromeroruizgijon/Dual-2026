import { Component } from '@angular/core';
import { Alimento } from '../../models/alimento.model';
import { ComidaService } from '../../services/comida.service';
import { BackendService } from '../../services/backend.service'; // <--- IMPORTANTE
import { Subject, debounceTime, switchMap, of, catchError, retry } from 'rxjs';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {
  // Variables de estado
  termino: string = '';           
  resultados: Alimento[] = [];    
  cargando: boolean = false;      
  alimentoSeleccionado: any | null = null;
  errorApi: boolean = false;
  alertaDieta: string | null = null;
  categoriaActiva: string = '';

  // Configuración de categorías
  categoriasRapidas = [
    { id: 'meats', nombre: 'Carnes', icono: '🥩' },
    { id: 'seafood', nombre: 'Pescados', icono: '🐟' },
    { id: 'fruits', nombre: 'Frutas', icono: '🍎' },
    { id: 'vegetables', nombre: 'Verduras', icono: '🥦' },
    { id: 'cheeses', nombre: 'Quesos', icono: '🧀' },
    { id: 'cereals', nombre: 'Cereales', icono: '🌾' }
  ];

  private buscadorSubject = new Subject<string>();

  constructor(
    private comidaService: ComidaService,
    private backend: BackendService // <--- Inyectamos el servicio de Laravel
  ) {
    // Lógica del buscador reactivo con debounce y retry
    this.buscadorSubject.pipe(
      debounceTime(500), 
      switchMap(valor => {
        if (!valor || valor.trim().length < 3) {
          this.resultados = [];
          this.cargando = false;
          this.errorApi = false;
          return of([]); 
        }
        
        this.cargando = true;
        this.errorApi = false;
        
        return this.comidaService.buscarAlimentos(valor).pipe(
          retry({ count: 2, delay: 1000 }), 
          catchError(err => {
            console.error('La API ha fallado tras varios intentos:', err);
            this.cargando = false;
            this.errorApi = true;
            return of([]); 
          })
        );
      })
    ).subscribe({
      next: (data) => {
        if (!this.errorApi) {
          this.resultados = data;
        }
        this.cargando = false;
      }
    });
  }

  // --- MÉTODOS DE BÚSQUEDA ---

  onKeySearch(texto: string) {
    this.buscadorSubject.next(texto);
  }

  buscarManual() {
    this.buscadorSubject.next(this.termino);
  }

  buscarCategoria(categoriaId: string) {
    this.termino = '';
    this.resultados = [];
    this.cargando = true;
    this.errorApi = false;
    this.categoriaActiva = categoriaId;

    this.comidaService.buscarPorCategoria(categoriaId).subscribe({
      next: (data) => {
        this.resultados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error buscando categoría:', err);
        this.cargando = false;
        this.errorApi = true;
      }
    });
  }

  limpiarBusqueda() {
    this.termino = '';
    this.resultados = [];
    this.categoriaActiva = '';
    this.errorApi = false;
    this.cargando = false;
  }

  // --- DETALLES Y COMPATIBILIDAD ---

  verDetalles(alimento: any) {
    this.alimentoSeleccionado = alimento;
    this.comprobarCompatibilidad(alimento);
  }

  comprobarCompatibilidad(alimento: any) {
    const miDieta = localStorage.getItem('miDieta') || 'ninguna';
    this.alertaDieta = null;

    if (miDieta === 'ninguna') return;

    const ingredientes = alimento.ingredientesTags || [];
    const alergenos = alimento.alergenosTags || [];

    if (miDieta === 'vegana' && ingredientes.includes('en:non-vegan')) {
      this.alertaDieta = '🚫 Contiene ingredientes de origen animal (No apto para Veganos).';
    } 
    else if (miDieta === 'vegetariana' && ingredientes.includes('en:non-vegetarian')) {
      this.alertaDieta = '🚫 Contiene carne o derivados (No apto para Vegetarianos).';
    } 
    else if (miDieta === 'singluten' && alergenos.includes('en:gluten')) {
      this.alertaDieta = '⚠️ ATENCIÓN: Este producto contiene Gluten.';
    }
    else if (miDieta === 'sinlactosa' && (alergenos.includes('en:milk') || alergenos.includes('en:lactose'))) {
      this.alertaDieta = '⚠️ ATENCIÓN: Este producto contiene Lactosa o derivados lácteos.';
    }
    else if (miDieta === 'sinpalma' && ingredientes.includes('en:palm-oil')) {
      this.alertaDieta = '🌴 Este producto contiene Aceite de Palma.';
    }
  }

  // --- PERSISTENCIA EN LARAVEL ---

  aniadirAlDiario() {
    if (!this.alimentoSeleccionado || !this.alimentoSeleccionado.cantidadSeleccionada) {
      alert('Por favor, introduce una cantidad válida');
      return;
    }

    // Preparamos el objeto para Laravel siguiendo tu migración
    const registro = {
      alimento_id: this.alimentoSeleccionado.id.toString(),
      nombre: this.alimentoSeleccionado.nombre,
      marca: this.alimentoSeleccionado.marca,
      imagen: this.alimentoSeleccionado.imagen,
      cantidad: this.alimentoSeleccionado.cantidadSeleccionada,
      // Calculamos macros según la cantidad seleccionada
      calorias: (this.alimentoSeleccionado.calorias * this.alimentoSeleccionado.cantidadSeleccionada) / 100,
      proteinas: (this.alimentoSeleccionado.proteinas * this.alimentoSeleccionado.cantidadSeleccionada) / 100,
      carbohidratos: (this.alimentoSeleccionado.carbohidratos * this.alimentoSeleccionado.cantidadSeleccionada) / 100,
      grasas: (this.alimentoSeleccionado.grasas * this.alimentoSeleccionado.cantidadSeleccionada) / 100,
      tipo_comida: 'Comida', // Esto lo haremos dinámico más adelante
      fecha: new Date().toISOString().split('T')[0] 
    };

    // Llamada al backend de Laravel
    this.backend.guardarEnDiario(registro).subscribe({
      next: (res) => {
        console.log('Respuesta de Laravel:', res);
        alert(`${this.alimentoSeleccionado.nombre} guardado en tu base de datos.`);
        this.alimentoSeleccionado = null;
      },
      error: (err) => {
        console.error('Error al guardar en Laravel:', err);
        alert('Hubo un error al conectar con el servidor. Revisa si Laravel está encendido.');
      }
    });
  }
}