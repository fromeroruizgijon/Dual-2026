import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiarioService } from '../services/diario.service';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  private apiUrl = 'http://127.0.0.1:8000/api';

  usuario = { nombre: '', email: '', miembroDesde: '' };
  guardando = false;
  exitoPerfil = false;
  errorPerfil = '';

  password = { actual: '', nuevo: '', confirmar: '' };
  guardandoPass = false;
  exitoPass = false;
  errorPass = '';

  dietaActual = '';
  diasRegistrados = 0;
  caloHoy = 0;
  mediaSemanal = 0;

  constructor(private http: HttpClient, private diarioService: DiarioService) {}

  ngOnInit() {
    this.http.get<any>(`${this.apiUrl}/user`).subscribe(user => {
      this.usuario.nombre = user.name || '';
      this.usuario.email = user.email || '';
      this.usuario.miembroDesde = user.created_at || '';
    });

    this.dietaActual = localStorage.getItem('miDieta') || 'ninguna';

    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    this.diarioService.obtenerDiario(hoyStr).subscribe(registros => {
      this.caloHoy = registros.reduce((a: number, r: any) => a + Number(r.calorias || 0), 0);
    });

    this.diarioService.obtenerEstadisticas(7).subscribe(data => {
      this.diasRegistrados = data.length;
      if (data.length > 0) {
        const total = data.reduce((a: number, d: any) => a + Number(d.calorias), 0);
        this.mediaSemanal = Math.round(total / data.length);
      }
    });
  }

  guardarPerfil(form: any) {
    if (form.invalid) return;
    this.guardando = true;
    this.exitoPerfil = false;
    this.errorPerfil = '';

    this.http.put(`${this.apiUrl}/user/perfil`, {
      name: this.usuario.nombre,
      email: this.usuario.email
    }).subscribe({
      next: () => {
        this.guardando = false;
        this.exitoPerfil = true;
        setTimeout(() => this.exitoPerfil = false, 3000);
      },
      error: (err) => {
        this.guardando = false;
        this.errorPerfil = err.status === 422 ? 'El email ya está en uso por otra cuenta.' : 'Error al guardar. Inténtalo de nuevo.';
      }
    });
  }

  cambiarPassword() {
    if (this.password.nuevo !== this.password.confirmar) {
      this.errorPass = 'Las contraseñas nuevas no coinciden.';
      return;
    }
    this.guardandoPass = true;
    this.exitoPass = false;
    this.errorPass = '';

    this.http.put(`${this.apiUrl}/user/password`, {
      password_actual: this.password.actual,
      password_nuevo: this.password.nuevo,
      password_nuevo_confirmation: this.password.confirmar
    }).subscribe({
      next: () => {
        this.guardandoPass = false;
        this.exitoPass = true;
        this.password = { actual: '', nuevo: '', confirmar: '' };
        setTimeout(() => this.exitoPass = false, 3000);
      },
      error: (err) => {
        this.guardandoPass = false;
        this.errorPass = err.status === 422 ? 'La contraseña actual no es correcta.' : 'Error al cambiar la contraseña.';
      }
    });
  }

  get dietaLabel(): string {
    const labels: any = {
      vegana:      'Vegana',
      vegetariana: 'Vegetariana',
      singluten:   'Sin Gluten',
      sinlactosa:  'Sin Lactosa',
      sinpalma:    'Sin Aceite de Palma',
      ninguna:     'Sin restricciones'
    };
    return labels[this.dietaActual] || 'Sin restricciones';
  }

  get dietaIcono(): string {
    const iconos: any = {
      vegana:      'bi-flower2',
      vegetariana: 'bi-egg-fried',
      singluten:   'bi-slash-circle',
      sinlactosa:  'bi-cup-hot',
      sinpalma:    'bi-tree',
      ninguna:     'bi-basket'
    };
    return iconos[this.dietaActual] || 'bi-basket';
  }

  get miembroDesdeFormateado(): string {
    if (!this.usuario.miembroDesde) return '';
    return new Date(this.usuario.miembroDesde).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
}
