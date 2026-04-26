import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  registrar(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, datos).pipe(
      tap((res: any) => {
        if (res.token) this.guardarSesion(res.token, res.user);
      })
    );
  }

  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((res: any) => {
        if (res.token) this.guardarSesion(res.token, res.user);
      })
    );
  }

  // Guarda el token y el flag de admin que devuelve el backend
  private guardarSesion(token: string, user: any) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('is_admin', user?.is_admin ? 'true' : 'false');
  }

  // Invalida el token en el servidor y limpia el almacenamiento local
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => this.limpiarSesion())
    );
  }

  // Limpieza local en caso de error o token expirado
  limpiarSesion() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('is_admin');
  }

  estaLogueado(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  // Lee el flag guardado por el backend al hacer login, no se puede falsear sin token válido
  esAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }
}
