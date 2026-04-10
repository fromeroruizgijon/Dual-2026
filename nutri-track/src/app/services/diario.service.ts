import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiarioService {
  private apiUrl = 'http://127.0.0.1:8000/api/diario';

  constructor(private http: HttpClient) { }

  // Guardar alimento en la DB
  guardarAlimento(alimento: any): Observable<any> {
    return this.http.post(this.apiUrl, alimento);
  }

  // Obtener el diario (más adelante lo usaremos en el componente Diario)
  obtenerDiario(fecha: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${fecha}`);
  }
}
