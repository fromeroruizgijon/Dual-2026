import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html'
})
export class RegistroComponent {
  usuario = {
    name: '',
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onRegistro() {
    this.authService.registrar(this.usuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado y logueado!', res);
        alert('¡Cuenta creada con éxito! Bienvenido.');
        this.router.navigate(['/diario']);
      },
      error: (err) => {
        console.error('Error en el registro', err);
        // Manejo básico de errores (ej: email ya existe)
        if (err.status === 422) {
          alert('El email ya está registrado o los datos son inválidos.');
        } else {
          alert('Ha ocurrido un error. Inténtalo más tarde.');
        }
      }
    });
  }
}
