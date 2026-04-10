import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ajusta esta URL si tu Laravel corre en otro puerto
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  // 1. Registro de usuario
  registrar(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos).pipe(
      tap((res: any) => {
        if (res.token) this.guardarToken(res.token);
      })
    );
  }

  // 2. Login de usuario
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res: any) => {
        if (res.token) this.guardarToken(res.token);
      })
    );
  }

  // 3. Guardar el token en el navegador
  private guardarToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // 4. Cerrar sesión
  logout() {
    localStorage.removeItem('auth_token');
  }

  // 5. Comprobar si estamos dentro
  estaLogueado(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
