import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { DietasComponent } from './pages/dietas/dietas.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { StatsComponent } from './pages/stats/stats.component';

const routes: Routes = [
  { path: '', redirectTo: '/buscar', pathMatch: 'full' },
  { path: 'buscar', component: BuscadorComponent },
  { path: 'dietas', component: DietasComponent },
  { path: 'diario', component: DiarioComponent },
  { path: 'stats', component: StatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
