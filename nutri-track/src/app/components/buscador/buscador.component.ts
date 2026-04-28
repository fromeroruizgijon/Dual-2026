import { Component, OnInit } from '@angular/core';
import { Alimento } from '../../models/alimento.model';
import { ComidaService } from '../../services/comida.service';
import { DiarioService } from '../../services/diario.service';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.component.html'
})
export class BuscadorComponent implements OnInit {
  resultados: Alimento[] = [];    
  cargando: boolean = false;      
  cargandoDetalles: boolean = false;
  alimentoSeleccionado: Alimento | null = null;
  
  terminoBusqueda: string = '';
  categoriaActiva: string = '';
  dietaUsuario: string = '';
  alertaDieta: string | null = null;
  hasBuscado: boolean = false;
  
  // Para sustituir los alerts
  mensajeExito: boolean = false;
  mensajeError: string | null = null;

  categorias: string[] = ['Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 'Pasta', 'Pork', 'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian', 'Breakfast'];
  paises: string[] = ['American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 'Egyptian', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican', 'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Vietnamese'];

  ingredientesPrincipales = [
    { nombre: 'Pollo', busqueda: 'chicken_breast', icono: 'bi-egg-fill' },
    { nombre: 'Salmón', busqueda: 'salmon', icono: 'bi-water' },
    { nombre: 'Huevo', busqueda: 'egg', icono: 'bi-egg' },
    { nombre: 'Cerdo', busqueda: 'pork', icono: 'bi-piggy-bank' },
    { nombre: 'Aguacate', busqueda: 'avocado', icono: 'bi-tree' },
    { nombre: 'Ajo', busqueda: 'garlic', icono: 'bi-circle' }
  ];

  constructor(private comidaService: ComidaService, private diarioService: DiarioService) {}

  ngOnInit() {
    this.dietaUsuario = localStorage.getItem('miDieta') || 'ninguna';
  }

  buscarPorNombre() {
    if (!this.terminoBusqueda.trim()) return;
    this.ejecutarBusqueda(this.comidaService.buscarPorNombre(this.terminoBusqueda));
  }

  buscarPorFiltroCat(cat: string) {
    if (!cat) return;
    this.ejecutarBusqueda(this.comidaService.buscarPorCategoria(cat));
  }

  buscarPorFiltroPais(pais: string) {
    if (!pais) return;
    this.ejecutarBusqueda(this.comidaService.buscarPorPais(pais));
  }

  buscarRapida(ing: string) {
    this.categoriaActiva = ing;
    this.ejecutarBusqueda(this.comidaService.buscarPorIngrediente(ing));
  }

  private ejecutarBusqueda(obs: any) {
    this.cargando = true;
    this.hasBuscado = true;
    this.resultados = [];
    obs.subscribe({
      next: (data: any) => {
        this.resultados = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  verDetalles(alimento: Alimento) {
    this.cargandoDetalles = true;
    this.alertaDieta = null;
    this.mensajeExito = false;
    this.mensajeError = null;

    this.comidaService.obtenerDetalles(alimento.id!).subscribe(detalle => {
      if (detalle) {
        this.alimentoSeleccionado = detalle;
        this.comprobarAlertasDieta(detalle); 
      }
      this.cargandoDetalles = false;
    });
  }

  comprobarAlertasDieta(alimento: Alimento) {
    if (!this.dietaUsuario || this.dietaUsuario === 'ninguna') return;
    let texto = `${alimento.nombre} ${alimento.categoria} ${alimento.listaIngredientes?.join(' ')}`.toLowerCase();

    const dietas: any = {
      vegana: { p: ['chicken', 'beef', 'pork', 'salmon', 'egg', 'milk', 'cheese', 'honey', 'fish', 'meat', 'butter', 'cream', 'gelatin'], m: 'No apto para dieta Vegana.' },
      vegetariana: { p: ['chicken', 'beef', 'pork', 'salmon', 'fish', 'meat', 'gelatin'], m: 'No apto para dieta Vegetariana.' },
      singluten: { p: ['wheat', 'flour', 'bread', 'pasta', 'seitan', 'barley', 'pastry', 'noodles', 'spaghetti', 'macaroni', 'couscous'], m: 'Contiene Gluten.' },
      sinlactosa: { p: ['milk', 'cheese', 'cream', 'butter', 'yogurt', 'gruyere', 'parmesan', 'mascarpone', 'mozzarella'], m: 'Contiene lácteos.' }
    };

    const actual = dietas[this.dietaUsuario];
    if (actual && actual.p.some((ing: string) => texto.includes(ing))) {
      this.alertaDieta = actual.m;
    }
  }

  aniadirAlDiario() {
    const alimento = this.alimentoSeleccionado;
    if (!alimento || !alimento.cantidadSeleccionada || alimento.cantidadSeleccionada <= 0) {
      this.mensajeError = 'Introduce una cantidad válida.';
      return;
    }

    const factor = alimento.cantidadSeleccionada / 100;
    const registro = {
      alimento_id: alimento.id,
      nombre: alimento.nombre,
      marca: alimento.categoria,
      imagen: alimento.imagen,
      cantidad: alimento.cantidadSeleccionada,
      calorias: alimento.calorias * factor,
      proteinas: alimento.proteinas * factor,
      carbohidratos: alimento.carbohidratos * factor,
      grasas: alimento.grasas * factor,
      tipo_comida: 'Comida',
      fecha: new Date().toISOString().split('T')[0]
    };

    this.diarioService.guardarAlimento(registro).subscribe({
      next: () => { 
        this.mensajeExito = true;
        setTimeout(() => this.alimentoSeleccionado = null, 1500);
      },
      error: () => this.mensajeError = 'Error al guardar.'
    });
  }
}