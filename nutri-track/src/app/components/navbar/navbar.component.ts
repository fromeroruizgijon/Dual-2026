import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}

  onLogout() {
    // Llama al backend para invalidar el token y luego limpia localmente
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        // Si el servidor falla, limpiamos la sesión local igualmente
        this.authService.limpiarSesion();
        this.router.navigate(['/login']);
      }
    });
  }
}
