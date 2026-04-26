import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { DietasComponent } from './pages/dietas/dietas.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { StatsComponent } from './pages/stats/stats.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { PerfilComponent } from './perfil/perfil.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'buscar', component: BuscadorComponent, canActivate: [authGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [authGuard] },
  { path: 'dietas', component: DietasComponent, canActivate: [authGuard] },
  { path: 'diario', component: DiarioComponent, canActivate: [authGuard] },
  // Admin protegido con adminGuard: requiere token válido Y is_admin = true
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  // Perfil requiere estar logueado
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
