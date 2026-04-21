import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alimento } from '../models/alimento.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl';
  
  // Tu identificación oficial
  private userTag = 'faganromero2006'; 

  constructor(private http: HttpClient) { }

  buscarAlimentos(termino: string, pagina: number = 1): Observable<Alimento[]> {
    const fields = 'product_name,brands,image_small_url,nutriments,nutriscore_grade,labels_tags,id';
    
    // Configuramos 6 resultados por página y nos identificamos
    const url = `${this.apiUrl}?search_terms=${encodeURIComponent(termino)}` +
                `&search_simple=1&action=process&json=1` +
                `&fields=${fields}` +
                `&page_size=6` + 
                `&page=${pagina}` +
                `&tagtype_0=countries&tag_0=spain` + 
                `&user=${this.userTag}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response || !response.products) return [];
        return response.products.map((food: any) => this.mapearAlimento(food));
      }),
      catchError(err => {
        console.error('Error en API:', err);
        return of([]);
      })
    );
  }

  buscarPorCategoria(categoria: string, pagina: number = 1): Observable<Alimento[]> {
    const fields = 'product_name,brands,image_small_url,nutriments,nutriscore_grade,labels_tags,id';
    const url = `${this.apiUrl}?tagtype_0=categories&tag_0=${categoria}` +
                `&fields=${fields}&action=process&json=1&page_size=6&page=${pagina}&user=${this.userTag}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response || !response.products) return [];
        return response.products.map((food: any) => this.mapearAlimento(food));
      }),
      catchError(err => {
        console.error('Error categoría:', err);
        return of([]);
      })
    );
  }

  private mapearAlimento(food: any): Alimento {
    const nuts = food.nutriments || {};
    return {
      id: food.id || food._id || Math.random().toString(),
      nombre: food.product_name || 'Sin nombre',
      marca: food.brands || 'Genérico',
      imagen: food.image_small_url || 'assets/no-image.png',
      nutriscore: food.nutriscore_grade || '',
      calorias: Math.round(nuts['energy-kcal_100g'] || 0),
      carbohidratos: nuts.carbohydrates_100g || 0,
      proteinas: nuts.proteins_100g || 0,
      grasas: nuts.fat_100g || 0,
      ingredientesTags: food.labels_tags || [],
      ingredientesTexto: food.ingredients_text || 'No disponible',
      alergenosTags: food.labels_tags || []
    };
  }
}