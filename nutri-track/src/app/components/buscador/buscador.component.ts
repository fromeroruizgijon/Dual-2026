import { Component } from '@angular/core';
import { Alimento } from '../../models/alimento.model';
import { ComidaService } from '../../services/comida.service';
import { DiarioService } from '../../services/diario.service';
import { Subject, debounceTime, switchMap, of, catchError } from 'rxjs';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {
  termino: string = '';           
  resultados: Alimento[] = [];    
  cargando: boolean = false;      
  alimentoSeleccionado: any | null = null;
  errorApi: boolean = false;
  alertaDieta: string | null = null;
  categoriaActiva: string = '';
  
  // Paginación
  paginaActual: number = 1;
  hayMasResultados: boolean = false;

  categoriasRapidas = [
    { id: 'en:beverages', nombre: 'Bebidas', icono: '🥤' },
    { id: 'en:snacks', nombre: 'Snacks', icono: '🍿' },
    { id: 'en:meals', nombre: 'Platos', icono: '🍽️' }
  ];

  private buscadorSubject = new Subject<string>();

  constructor(
    private comidaService: ComidaService,
    private diarioService: DiarioService
  ) {
    this.buscadorSubject.pipe(
      debounceTime(1200), // Un poco más de tiempo para ser "buenos" con la API
      switchMap(valor => {
        if (!valor || valor.trim().length < 3) {
          this.resultados = [];
          this.cargando = false;
          return of([]); 
        }
        this.cargando = true;
        this.errorApi = false;
        this.paginaActual = 1;
        return this.comidaService.buscarAlimentos(valor, this.paginaActual).pipe(
          catchError(() => {
            this.errorApi = true;
            this.cargando = false;
            return of([]); 
          })
        );
      })
    ).subscribe(data => {
      this.resultados = data;
      this.hayMasResultados = data.length === 6;
      this.cargando = false;
    });
  }

  onKeySearch(texto: string) { this.buscadorSubject.next(texto); }

  buscarManual() {
    if (this.termino.trim().length < 3) return;
    this.cargando = true;
    this.paginaActual = 1;
    this.comidaService.buscarAlimentos(this.termino, this.paginaActual).subscribe({
      next: (data) => {
        this.resultados = data;
        this.hayMasResultados = data.length === 6;
        this.cargando = false;
      },
      error: () => { this.errorApi = true; this.cargando = false; }
    });
  }

  cargarMas() {
    this.paginaActual++;
    this.cargando = true;
    this.comidaService.buscarAlimentos(this.termino, this.paginaActual).subscribe(data => {
      this.resultados = [...this.resultados, ...data];
      this.hayMasResultados = data.length === 6;
      this.cargando = false;
    });
  }

  buscarCategoria(categoriaId: string) {
    this.limpiarBusqueda();
    this.cargando = true;
    this.categoriaActiva = categoriaId;
    this.paginaActual = 1;
    this.comidaService.buscarPorCategoria(categoriaId, this.paginaActual).subscribe({
      next: (data) => {
        this.resultados = data;
        this.hayMasResultados = data.length === 6;
        this.cargando = false;
      },
      error: () => { this.errorApi = true; this.cargando = false; }
    });
  }

  limpiarBusqueda() {
    this.termino = '';
    this.resultados = [];
    this.categoriaActiva = '';
    this.cargando = false;
    this.hayMasResultados = false;
  }

  verDetalles(alimento: any) {
    this.alimentoSeleccionado = alimento;
    this.comprobarCompatibilidad(alimento);
  }

  comprobarCompatibilidad(alimento: any) {
    const miDieta = localStorage.getItem('miDieta') || 'ninguna';
    this.alertaDieta = null;
    const tags = alimento.ingredientesTags || [];
    if (miDieta === 'vegana' && !tags.includes('en:vegan')) this.alertaDieta = '🚫 No tiene certificado Vegano.';
    else if (miDieta === 'vegetariana' && !tags.includes('en:vegetarian')) this.alertaDieta = '🚫 No apto para vegetarianos.';
    else if (miDieta === 'singluten' && !tags.includes('en:gluten-free')) this.alertaDieta = '⚠️ ATENCIÓN: Puede contener Gluten.';
    else if (miDieta === 'sinlactosa' && !tags.includes('en:no-dairy')) this.alertaDieta = '⚠️ ATENCIÓN: Contiene lácteos.';
  }

  aniadirAlDiario() {
    if (!this.alimentoSeleccionado?.cantidadSeleccionada) {
      alert('Introduce una cantidad');
      return;
    }
    const registro = {
      nombre: this.alimentoSeleccionado.nombre,
      marca: this.alimentoSeleccionado.marca,
      calorias: this.alimentoSeleccionado.calorias,
      proteinas: this.alimentoSeleccionado.proteinas,
      carbohidratos: this.alimentoSeleccionado.carbohidratos,
      grasas: this.alimentoSeleccionado.grasas,
      cantidadSeleccionada: this.alimentoSeleccionado.cantidadSeleccionada,
      imagen: this.alimentoSeleccionado.imagen,
      ingredientesTexto: this.alimentoSeleccionado.ingredientesTexto,
      alergenosTags: JSON.stringify(this.alimentoSeleccionado.alergenosTags)
    };
    this.diarioService.guardarAlimento(registro).subscribe({
      next: () => { alert('Guardado'); this.alimentoSeleccionado = null; },
      error: () => alert('Error con Laravel')
    });
  }
}