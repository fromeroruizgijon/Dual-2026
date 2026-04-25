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
  chartSemana: any;
  chartMes: any;
  
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

  cargarDatosDiarios() {
    this.cargandoGrafico = true;
    const hoy = new Date().toISOString().split('T')[0];

    this.diarioService.obtenerDiario(hoy).subscribe({
      next: (registros) => {
        let p = 0, c = 0, g = 0;

        registros.forEach((reg: any) => {
          p += Number(reg.proteinas) || 0;
          c += Number(reg.carbohidratos) || 0;
          g += Number(reg.grasas) || 0;
        });

        this.pieChartData.datasets[0].data = [p, c, g];
        
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
        const calorias = data.map((item: any) => item.calorias);
        this.renderizarGraficoSemana(fechas, calorias);
      },
      error: (err) => console.error('Error al cargar la semana', err)
    });
  }
  cargarDatosMes() {
    this.diarioService.obtenerEstadisticas(30).subscribe({
      next: (data) => {
        const fechas = data.map((item: any) => item.fecha);
        const calorias = data.map((item: any) => item.calorias);
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
          backgroundColor: '#66bb6a', // Tu color success de SASS
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
          borderColor: '#2e7d32', // Tu color primary de SASS
          fill: true,
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          tension: 0.4 // Hace que la línea sea curva en vez de recta
        }]
      },
      options: { responsive: true }
    });
  }
}
