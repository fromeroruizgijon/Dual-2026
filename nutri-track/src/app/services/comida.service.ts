import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Eliminamos HttpHeaders de aquí
import { Alimento } from '../models/alimento.model';
import { Observable, of } from 'rxjs';
import { map, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  // URL base de la API de Open Food Facts para búsquedas de texto
  private apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(private http: HttpClient) { }

  // Función para buscar alimentos por nombre (TEXTO LIBRE)
  buscarAlimentos(termino: string): Observable<Alimento[]> {
    const url = `${this.apiUrl}?search_terms=${termino}&search_simple=1&action=process&json=1&page_size=20`;
    
    // Petición limpia, sin mandar cabeceras "User-Agent" que bloquea el navegador
    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response.products) return [];

        return response.products.map((p: any) => ({
          id: p.code,
          nombre: p.product_name || 'Sin nombre',
          marca: p.brands || 'Marca desconocida',
          imagen: p.image_front_small_url || 'assets/no-image.png',
          nutriscore: p.nutriscore_grade,
          calorias: p.nutriments['energy-kcal_100g'] || 0,
          carbohidratos: p.nutriments['carbohydrates_100g'] || 0,
          proteinas: p.nutriments['proteins_100g'] || 0,
          grasas: p.nutriments['fat_100g'] || 0,
          // Recogemos las etiquetas para que funcione la alerta de dietas al buscar por texto
          ingredientesTags: p.ingredients_analysis_tags || [],
          ingredientesTexto: p.ingredients_text_es || p.ingredients_text || 'Lista de ingredientes no disponible en la base de datos.',
          alergenosTags: p.allergens_tags || []
        }));
      })
    );
  }

  // Función para buscar alimentos por CATEGORÍA (API V2)
  buscarPorCategoria(categoria: string): Observable<Alimento[]> {
    // Añadidos ingredients_analysis_tags y allergens_tags a los "fields" obligatorios
    const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags_en=${categoria}&fields=code,product_name,brands,image_front_url,nutriments,nutriscore_grade,ingredients_analysis_tags,ingredients_text_es,ingredients_text,allergens_tags&page_size=24`;

    return this.http.get<any>(url).pipe(
      retry({ count: 3, delay: 2500 }),
      
      map(response => {
        if (!response.products) return [];
        return response.products
          .filter((p: any) => p.product_name && p.nutriments)
          .map((p: any) => ({
            id: p.code || p._id,
            nombre: p.product_name,
            marca: p.brands || 'Sin marca',
            imagen: p.image_front_url || 'https://via.placeholder.com/150?text=Sin+Imagen',
            calorias: p.nutriments['energy-kcal_100g'] || 0,
            proteinas: p.nutriments.proteins_100g || 0,
            carbohidratos: p.nutriments.carbohydrates_100g || 0,
            grasas: p.nutriments.fat_100g || 0,
            nutriscore: p.nutriscore_grade || '',
            // Guardamos las etiquetas ocultas de la API V2
            ingredientesTags: p.ingredients_analysis_tags || [],
            ingredientesTexto: p.ingredients_text_es || p.ingredients_text || 'Lista de ingredientes no disponible en la base de datos.',
            alergenosTags: p.allergens_tags || []
          }));
      }),
      
      catchError(err => {
        console.error('API saturada tras 4 intentos:', err);
        return of([]);
      })
    );
  }
}