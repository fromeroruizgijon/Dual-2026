import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false, // O true si usas standalone
  templateUrl: './login.component.html'
})
export class LoginComponent {
  credenciales = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credenciales).subscribe({
      next: () => {
        this.router.navigate(['/diario']);
      },
      error: () => {
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    });
  }
}
