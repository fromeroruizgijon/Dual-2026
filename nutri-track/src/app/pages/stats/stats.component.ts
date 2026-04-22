import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { DiarioService } from '../../services/diario.service';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent implements OnInit {
  
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
}
