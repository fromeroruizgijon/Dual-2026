import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/diario';

  constructor(private http: HttpClient) { }

  guardarAlimento(alimento: any): Observable<any> {
    return this.http.post(this.apiUrl, alimento);
  }

  obtenerDiario(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${fecha}`);
  }

  eliminarAlimento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  actualizarAlimento(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datos);
  }

  obtenerEstadisticas(dias: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas/${dias}`);
  }
}
