import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alimento } from '../models/alimento.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  // Credenciales de Edamam
  private appId = '926dc453';
  private appKey = 'd9040651b17c91020b698f0e32674bdc';
  private apiUrl = 'https://api.edamam.com/api/food-database/v2/parser';

  constructor(private http: HttpClient) { }

  // Buscar por texto
  buscarAlimentos(termino: string): Observable<Alimento[]> {
    const url = `${this.apiUrl}?app_id=${this.appId}&app_key=${this.appKey}&ingr=${termino}&nutrition-type=logging`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response.hints) return [];

        return response.hints.map((item: any) => {
          const food = item.food;
          return {
            id: food.foodId,
            nombre: food.label || 'Sin nombre',
            marca: food.brand || 'Genérico',
            imagen: food.image || 'assets/no-image.png',
            nutriscore: '', // Edamam no devuelve Nutriscore directamente
            calorias: food.nutrients.ENERC_KCAL || 0,
            carbohidratos: food.nutrients.CHOCDF || 0,
            proteinas: food.nutrients.PROCNT || 0,
            grasas: food.nutrients.FAT || 0,
            // Edamam usa healthLabels para dietas y alérgenos
            ingredientesTags: food.healthLabels || [],
            ingredientesTexto: food.foodContentsLabel || 'Ingredientes no disponibles.',
            alergenosTags: food.healthLabels || []
          };
        });
      }),
      catchError(err => {
        console.error('Error en Edamam:', err);
        return of([]);
      })
    );
  }

  // Buscar por Categoría (Adaptado para Edamam)
  buscarPorCategoria(categoria: string): Observable<Alimento[]> {
    // Edamam permite filtrar por categoría en la misma URL de búsqueda
    const url = `${this.apiUrl}?app_id=${this.appId}&app_key=${this.appKey}&category=${categoria}&nutrition-type=logging`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (!response.hints) return [];
        return response.hints.map((item: any) => ({
          id: item.food.foodId,
          nombre: item.food.label,
          marca: item.food.brand || 'Genérico',
          imagen: item.food.image || 'https://via.placeholder.com/150?text=Sin+Imagen',
          calorias: item.food.nutrients.ENERC_KCAL || 0,
          proteinas: item.food.nutrients.PROCNT || 0,
          carbohidratos: item.food.nutrients.CHOCDF || 0,
          grasas: item.food.nutrients.FAT || 0,
          ingredientesTags: item.food.healthLabels || [],
          ingredientesTexto: item.food.foodContentsLabel || 'Ingredientes no disponibles.',
          alergenosTags: item.food.healthLabels || []
        }));
      }),
      catchError(err => {
        console.error('Error categoría Edamam:', err);
        return of([]);
      })
    );
  }
}