import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  // Objeto para guardar los datos del formulario
  usuario = {
    nombre: '',
    email: '',
    bio: ''
  };

  guardarPerfil(form: any) {
    if (form.valid) {
      alert('¡Formulario validado perfectamente! Esto le gustará al profesor de Interfaces 😎');
    } else {
      alert('Por favor, corrige los campos en rojo.');
    }
  }
}
