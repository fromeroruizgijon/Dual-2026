import { Component, OnInit } from '@angular/core';
import { Alimento } from '../../models/alimento.model';
import { ComidaService } from '../../services/comida.service';
import { DiarioService } from '../../services/diario.service';

@Component({
  selector: 'app-buscador',
  standalone: false,
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent implements OnInit {
  resultados: Alimento[] = [];    
  cargando: boolean = false;      
  cargandoDetalles: boolean = false;
  alimentoSeleccionado: Alimento | null = null;
  categoriaActiva: string = '';

  // NUEVAS VARIABLES PARA LAS DIETAS
  dietaUsuario: string = ''; 
  alertaDieta: string | null = null;

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

  ngOnInit() {
    // AHORA SÍ: Leemos la misma variable que guarda tu página de dietas
    this.dietaUsuario = localStorage.getItem('miDieta') || 'ninguna';
  }

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
    this.alertaDieta = null; // Reseteamos la alerta anterior

    if(alimento.id) {
        this.comidaService.obtenerDetalles(alimento.id).subscribe(detalle => {
          if (detalle) {
            this.alimentoSeleccionado = detalle;
            // LLAMAMOS A LA FUNCIÓN DE DETECCIÓN AQUÍ 👇
            this.comprobarAlertasDieta(detalle); 
          }
          this.cargandoDetalles = false;
        });
    }
  }

  // 🕵️ LÓGICA DE DETECCIÓN DE ALÉRGENOS/DIETAS
  comprobarAlertasDieta(alimento: Alimento) {
    if (!this.dietaUsuario || this.dietaUsuario === 'ninguna') return;

    // 1. Empezamos con el nombre y la categoría
    let textoAlimento = `${alimento.nombre} ${alimento.categoria}`.toLowerCase();

    // 2. ¡EL ARREGLO! Añadimos TODOS los ingredientes a la batidora de texto
    if (alimento.listaIngredientes && alimento.listaIngredientes.length > 0) {
      const todosLosIngredientes = alimento.listaIngredientes.join(' ').toLowerCase();
      textoAlimento += ` ${todosLosIngredientes}`;
    }

    if (this.dietaUsuario === 'vegana') {
      const prohibidosVegano = ['chicken', 'beef', 'pork', 'salmon', 'egg', 'milk', 'cheese', 'honey', 'fish', 'meat', 'butter', 'cream', 'gelatin'];
      const tieneCarne = prohibidosVegano.some(ing => textoAlimento.includes(ing));
      if (tieneCarne) {
        this.alertaDieta = '⚠️ No apto para dieta Vegana (Contiene ingredientes de origen animal).';
      }
    }

    if (this.dietaUsuario === 'vegetariana') {
      const prohibidosVegetariano = ['chicken', 'beef', 'pork', 'salmon', 'fish', 'meat', 'gelatin'];
      const tieneCarne = prohibidosVegetariano.some(ing => textoAlimento.includes(ing));
      if (tieneCarne) {
        this.alertaDieta = '⚠️ No apto para dieta Vegetariana (Contiene carne o pescado).';
      }
    }

    if (this.dietaUsuario === 'singluten') {
      // Hemos añadido más trampas de TheMealDB: pastry, noodles, spaghetti, macaroni...
      const prohibidosGluten = ['wheat', 'flour', 'bread', 'pasta', 'seitan', 'barley', 'pastry', 'noodles', 'spaghetti', 'macaroni', 'couscous'];
      const tieneGluten = prohibidosGluten.some(ing => textoAlimento.includes(ing));
      if (tieneGluten) {
        this.alertaDieta = '🛑 Riesgo Celíaco: Este producto parece contener Gluten.';
      }
    }

    if (this.dietaUsuario === 'sinlactosa') {
      // Hemos añadido: gruyere, parmesan, mascarpone...
      const prohibidosLactosa = ['milk', 'cheese', 'cream', 'butter', 'yogurt', 'gruyere', 'parmesan', 'mascarpone', 'mozzarella'];
      const tieneLactosa = prohibidosLactosa.some(ing => textoAlimento.includes(ing));
      if (tieneLactosa) {
        this.alertaDieta = '⚠️ Riesgo Intolerancia: Este producto contiene lácteos.';
      }
    }
  }

  aniadirAlDiario() {
    // Guardamos en local para que TypeScript sepa que no es null a partir de aquí
    const alimento = this.alimentoSeleccionado;
    const cantidad = alimento?.cantidadSeleccionada;
    if (!alimento || !cantidad || cantidad <= 0) {
      alert('Por favor, introduce una cantidad en gramos mayor que 0');
      return;
    }

    const factor = cantidad / 100;

    const registro = {
      alimento_id: alimento.id,
      nombre: alimento.nombre,
      marca: alimento.categoria,
      imagen: alimento.imagen,
      cantidad: cantidad,
      calorias: alimento.calorias * factor,
      proteinas: alimento.proteinas * factor,
      carbohidratos: alimento.carbohidratos * factor,
      grasas: alimento.grasas * factor,
      tipo_comida: 'Comida',
      fecha: new Date().toISOString().split('T')[0]
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