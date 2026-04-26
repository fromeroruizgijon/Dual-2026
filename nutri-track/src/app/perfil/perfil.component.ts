import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/api';

  usuario = {
    nombre: '',
    email: '',
    bio: ''
  };

  guardando = false;

  // El authInterceptor añade el token; solo necesitamos HttpClient
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Carga los datos actuales del usuario desde el backend al entrar en la página
    this.http.get<any>(`${this.apiUrl}/user`).subscribe({
      next: (user) => {
        this.usuario.nombre = user.name || '';
        this.usuario.email = user.email || '';
      }
    });
  }

  guardarPerfil(form: any) {
    if (form.invalid) {
      alert('Por favor, corrige los campos en rojo.');
      return;
    }

    this.guardando = true;
    this.http.put(`${this.apiUrl}/user/perfil`, {
      name: this.usuario.nombre,
      email: this.usuario.email
    }).subscribe({
      next: () => {
        this.guardando = false;
        alert('Perfil actualizado correctamente.');
      },
      error: (err) => {
        this.guardando = false;
        if (err.status === 422) {
          alert('El email ya está en uso por otra cuenta.');
        } else {
          alert('Error al guardar. Inténtalo de nuevo.');
        }
      }
    });
  }
}
