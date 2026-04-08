import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { DietasComponent } from './pages/dietas/dietas.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { StatsComponent } from './pages/stats/stats.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'buscar', component: BuscadorComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'diario', component: DiarioComponent },
  { path: 'dietas', component: DietasComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
