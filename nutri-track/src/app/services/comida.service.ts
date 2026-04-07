import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Alimento } from '../models/alimento.model';

@Injectable({
  providedIn: 'root'
})
export class ComidaService {
  // URL base de la API de Open Food Facts
  private apiUrl = 'https://world.openfoodfacts.org/cgi/search.pl';

  constructor(private http: HttpClient) { }

  // Función para buscar alimentos por nombre
  buscarAlimentos(termino: string): Observable<Alimento[]> {
    // 1. Definimos las cabeceras para que la API nos deje pasar
    const headers = new HttpHeaders({
      'User-Agent': 'NutriTrack - ProyectoEstudiante - Version 1.0'
    });

    const url = `${this.apiUrl}?search_terms=${termino}&search_simple=1&action=process&json=1&page_size=20`;
    
    // 2. Pasamos las headers en el objeto de opciones
    return this.http.get<any>(url, { headers }).pipe(
      map(response => {
        // Si no hay productos, devolvemos un array vacío
        if (!response.products) return [];

        return response.products.map((p: any) => ({
          id: p.code,
          nombre: p.product_name || 'Sin nombre',
          marca: p.brands || 'Marca desconocida',
          imagen: p.image_front_small_url || 'assets/no-image.png',
          nutriscore: p.nutriscore_grade,
          // Accedemos a los nutrientes de forma segura
          calorias: p.nutriments['energy-kcal_100g'] || 0,
          carbohidratos: p.nutriments['carbohydrates_100g'] || 0,
          proteinas: p.nutriments['proteins_100g'] || 0,
          grasas: p.nutriments['fat_100g'] || 0
        }));
      })
    );
  }
}
