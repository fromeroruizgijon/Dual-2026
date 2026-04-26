import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {

  usuarios: any[] = [];
  cargando: boolean = true;
  private apiUrl = 'http://127.0.0.1:8000/api/admin/usuarios';

  // El authInterceptor añade el token automáticamente; no hace falta gestionar headers aquí
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  eliminarUsuario(id: number, nombre: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          alert('Usuario eliminado con éxito');
          this.cargarUsuarios();
        },
        error: () => alert('Error al intentar eliminar el usuario.')
      });
    }
  }
}
