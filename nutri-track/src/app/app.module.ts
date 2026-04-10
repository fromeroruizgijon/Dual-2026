import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DietasComponent } from './pages/dietas/dietas.component';
import { DiarioComponent } from './pages/diario/diario.component';
import { StatsComponent } from './pages/stats/stats.component';

import { FormsModule } from '@angular/forms';
import { DetalleAlimentoComponent } from './components/detalle-alimento/detalle-alimento.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';

import { authInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';

@NgModule({
  declarations: [
    AppComponent,
    BuscadorComponent,
    NavbarComponent,
    DietasComponent,
    DiarioComponent,
    StatsComponent,
    DetalleAlimentoComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BaseChartDirective,
    FormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
