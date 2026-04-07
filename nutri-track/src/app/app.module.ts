import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DietasComponent } from './pages/dietas/dietas.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { StatsComponent } from './pages/stats/stats.component';

import { FormsModule } from '@angular/forms';
import { DetalleAlimentoComponent } from './components/detalle-alimento/detalle-alimento.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    BuscadorComponent,
    NavbarComponent,
    DietasComponent,
    DiarioComponent,
    StatsComponent,
    DetalleAlimentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BaseChartDirective
  ],
  providers: [
    provideHttpClient(),
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
