import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  // La URL donde está corriendo Laravel
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // Enviar un alimento al diario de Laravel
  guardarEnDiario(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/diario`, datos);
  }

  // Obtener los registros de una fecha concreta
  obtenerDiario(fecha: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/diario/${fecha}`);
  }
}
