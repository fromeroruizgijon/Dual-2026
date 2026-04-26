import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DiarioService } from '../../services/diario.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  
  // Gráficos manuales
  chartSemana: any;
  chartMes: any;
  
  // NUEVO: Control de pestañas y KPIs
  tabActiva: string = 'hoy'; 
  kpiHoyTotal: number = 0;
  kpiSemanaPromedio: number = 0;
  kpiMesTotal: number = 0;
  
  // Gráfico de tarta (ng2-charts)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    }
  };

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [ 'Proteínas (g)', 'Carbohidratos (g)', 'Grasas (g)' ],
    datasets: [ {
      data: [ 0, 0, 0 ],
      backgroundColor: ['#0d6efd', '#ffc107', '#dc3545'] 
    } ]
  };

  public pieChartType: ChartType = 'pie';
  public cargandoGrafico = true;

  constructor(private diarioService: DiarioService) {}

  ngOnInit() {
    this.cargarDatosDiarios();
    this.cargarDatosSemana();
    this.cargarDatosMes();
  }

  // Cambiar pestaña
  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  cargarDatosDiarios() {
    this.cargandoGrafico = true;
    const hoy = new Date().toISOString().split('T')[0];

    this.diarioService.obtenerDiario(hoy).subscribe({
      next: (registros) => {
        let p = 0, c = 0, g = 0, cal = 0;

        registros.forEach((reg: any) => {
          p += Number(reg.proteinas) || 0;
          c += Number(reg.carbohidratos) || 0;
          g += Number(reg.grasas) || 0;
          cal += Number(reg.calorias) || 0; // Sumamos calorías para el KPI
        });

        this.pieChartData.datasets[0].data = [p, c, g];
        this.kpiHoyTotal = cal; // Guardamos el total de hoy
        
        // Truco para forzar que Chart.js se repinte
        this.pieChartData = { ...this.pieChartData };
        this.cargandoGrafico = false;
      },
      error: () => {
        this.cargandoGrafico = false;
      }
    });
  }

  cargarDatosSemana() {
    this.diarioService.obtenerEstadisticas(7).subscribe({
      next: (data) => {
        const fechas = data.map((item: any) => item.fecha);
        const calorias = data.map((item: any) => Number(item.calorias));
        
        // Calcular promedio semanal
        if (calorias.length > 0) {
          const total = calorias.reduce((a: number, b: number) => a + b, 0);
          this.kpiSemanaPromedio = Math.round(total / calorias.length);
        }

        this.renderizarGraficoSemana(fechas, calorias);
      },
      error: (err) => console.error('Error al cargar la semana', err)
    });
  }

  cargarDatosMes() {
    this.diarioService.obtenerEstadisticas(30).subscribe({
      next: (data) => {
        const fechas = data.map((item: any) => item.fecha);
        const calorias = data.map((item: any) => Number(item.calorias));
        
        // Calcular total mensual
        if (calorias.length > 0) {
          this.kpiMesTotal = calorias.reduce((a: number, b: number) => a + b, 0);
        }

        this.renderizarGraficoMes(fechas, calorias);
      },
      error: (err) => console.error('Error al cargar el mes', err)
    });
  }

  renderizarGraficoSemana(etiquetas: string[], datos: number[]) {
    const canvas = document.getElementById('graficoSemana') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartSemana = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Calorías (Últimos 7 días)',
          data: datos,
          backgroundColor: '#66bb6a', 
          borderRadius: 5
        }]
      },
      options: { responsive: true }
    });
  }

  renderizarGraficoMes(etiquetas: string[], datos: number[]) {
    const canvas = document.getElementById('graficoMes') as HTMLCanvasElement;
    if (!canvas) return;

    this.chartMes = new Chart(canvas, {
      type: 'line',
      data: {
        labels: etiquetas,
        datasets: [{
          label: 'Tendencia Calorías (30 días)',
          data: datos,
          borderColor: '#2e7d32', 
          fill: true,
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4 
        }]
      },
      options: { responsive: true }
    });
  }
}
