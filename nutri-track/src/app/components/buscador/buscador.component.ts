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

  categoriasRapidas = [
    { id: 'generic-foods', nombre: 'Genéricos', icono: '🍎' },
    { id: 'packaged-foods', nombre: 'Envasados', icono: '📦' },
    { id: 'fast-foods', nombre: 'Rápida', icono: '🍔' }
  ];

  private buscadorSubject = new Subject<string>();

  constructor(
    private comidaService: ComidaService,
    private diarioService: DiarioService
  ) {
    this.buscadorSubject.pipe(
      debounceTime(800), // Bajamos el tiempo porque Edamam es más estable
      switchMap(valor => {
        if (!valor || valor.trim().length < 3) {
          this.resultados = [];
          this.cargando = false;
          return of([]); 
        }
        this.cargando = true;
        this.errorApi = false;
        return this.comidaService.buscarAlimentos(valor).pipe(
          catchError(() => {
            this.errorApi = true;
            this.cargando = false;
            return of([]); 
          })
        );
      })
    ).subscribe(data => {
      this.resultados = data;
      this.cargando = false;
    });
  }

  onKeySearch(texto: string) { this.buscadorSubject.next(texto); }
  buscarManual() { this.buscadorSubject.next(this.termino); }

  buscarCategoria(categoriaId: string) {
    this.termino = '';
    this.cargando = true;
    this.categoriaActiva = categoriaId;
    this.comidaService.buscarPorCategoria(categoriaId).subscribe({
      next: (data) => {
        this.resultados = data;
        this.cargando = false;
      },
      error: () => {
        this.errorApi = true;
        this.cargando = false;
      }
    });
  }

  limpiarBusqueda() {
    this.termino = '';
    this.resultados = [];
    this.categoriaActiva = '';
    this.cargando = false;
  }

  verDetalles(alimento: any) {
    this.alimentoSeleccionado = alimento;
    this.comprobarCompatibilidad(alimento);
  }

  comprobarCompatibilidad(alimento: any) {
    const miDieta = localStorage.getItem('miDieta') || 'ninguna';
    this.alertaDieta = null;
    if (miDieta === 'ninguna') return;

    const tags = alimento.ingredientesTags || [];

    // Mapeo de Edamam: Mucho más sencillo
    if (miDieta === 'vegana' && !tags.includes('VEGAN')) {
      this.alertaDieta = '🚫 No tiene certificado Vegano.';
    } 
    else if (miDieta === 'vegetariana' && !tags.includes('VEGETARIAN')) {
      this.alertaDieta = '🚫 No apto para vegetarianos.';
    } 
    else if (miDieta === 'singluten' && !tags.includes('GLUTEN_FREE')) {
      this.alertaDieta = '⚠️ ATENCIÓN: Puede contener Gluten.';
    }
    else if (miDieta === 'sinlactosa' && !tags.includes('DAIRY_FREE')) {
      this.alertaDieta = '⚠️ ATENCIÓN: Contiene lácteos.';
    }
  }

  aniadirAlDiario() {
    if (!this.alimentoSeleccionado || !this.alimentoSeleccionado.cantidadSeleccionada) {
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
      next: () => {
        alert('Guardado en Laravel');
        this.alimentoSeleccionado = null;
      },
      error: () => alert('Error al conectar con Laravel')
    });
  }
}