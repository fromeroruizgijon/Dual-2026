import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Alimento } from '../models/alimento.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  // macros estimados por categoría (por cada 100g), themealdb no proporciona valores nutricionales
  private macrosPorCategoria: any = {
    'Beef': { calorias: 250, proteinas: 26, carbohidratos: 0, grasas: 15 },
    'Chicken': { calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
    'Pasta': { calorias: 350, proteinas: 12, carbohidratos: 65, grasas: 5 },
    'Seafood': { calorias: 100, proteinas: 20, carbohidratos: 0, grasas: 2 },
    'Vegan': { calorias: 150, proteinas: 5, carbohidratos: 20, grasas: 5 },
    'Vegetarian': { calorias: 200, proteinas: 8, carbohidratos: 25, grasas: 7 },
    'Dessert': { calorias: 400, proteinas: 4, carbohidratos: 60, grasas: 18 },
    'Breakfast': { calorias: 180, proteinas: 10, carbohidratos: 30, grasas: 8 },
    'default': { calorias: 250, proteinas: 15, carbohidratos: 30, grasas: 10 }
  };

  constructor(private http: HttpClient) { }

  // buscar por texto libre
  buscarPorNombre(nombre: string): Observable<Alimento[]> {
    return this.http.get<any>(`${this.apiUrl}/search.php?s=${nombre}`).pipe(
      map(response => this.formatearLista(response)),
      catchError(() => of([]))
    );
  }

  // filtrar por categoría
  buscarPorCategoria(categoria: string): Observable<Alimento[]> {
    return this.http.get<any>(`${this.apiUrl}/filter.php?c=${categoria}`).pipe(
      map(response => this.formatearLista(response)),
      catchError(() => of([]))
    );
  }

  // filtrar por país
  buscarPorPais(pais: string): Observable<Alimento[]> {
    return this.http.get<any>(`${this.apiUrl}/filter.php?a=${pais}`).pipe(
      map(response => this.formatearLista(response)),
      catchError(() => of([]))
    );
  }

  // buscar por ingrediente principal
  buscarPorIngrediente(ingrediente: string): Observable<Alimento[]> {
    return this.http.get<any>(`${this.apiUrl}/filter.php?i=${ingrediente}`).pipe(
      map(response => this.formatearLista(response)),
      catchError(() => of([]))
    );
  }

  private formatearLista(response: any): Alimento[] {
    if (!response || !response.meals) return [];
    return response.meals.map((meal: any) => ({
      id: meal.idMeal,
      nombre: meal.strMeal,
      categoria: meal.strCategory || '',
      imagen: meal.strMealThumb,
      calorias: 0, carbohidratos: 0, proteinas: 0, grasas: 0
    }));
  }

  obtenerDetalles(id: string): Observable<Alimento | null> {
    return this.http.get<any>(`${this.apiUrl}/lookup.php?i=${id}`).pipe(
      map(response => {
        if (!response || !response.meals) return null;
        const plato = response.meals[0];
        const ingredientesLimpio = [];
        for (let i = 1; i <= 20; i++) {
          const ing = plato[`strIngredient${i}`];
          const med = plato[`strMeasure${i}`];
          if (ing && ing.trim() !== '') ingredientesLimpio.push(`${med} ${ing}`.trim());
        }
        const categoria = plato.strCategory || 'default';
        const macros = this.macrosPorCategoria[categoria] || this.macrosPorCategoria['default'];
        return {
          id: plato.idMeal,
          nombre: plato.strMeal,
          categoria: categoria,
          imagen: plato.strMealThumb,
          instrucciones: plato.strInstructions,
          listaIngredientes: ingredientesLimpio,
          calorias: macros.calorias,
          proteinas: macros.proteinas,
          carbohidratos: macros.carbohidratos,
          grasas: macros.grasas
        };
      }),
      catchError(() => of(null))
    );
  }
}