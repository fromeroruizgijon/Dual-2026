import { Component } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-stats',
  standalone: false,
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.scss'
})
export class StatsComponent {
  // Configuración del gráfico de tarta (Pie Chart)
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
      backgroundColor: ['#198754', '#ffc107', '#dc3545'] // Colores de Bootstrap
    } ]
  };

  public pieChartType: ChartType = 'pie';

  ngOnInit() {
    this.cargarDatosParaGrafico();
  }

  cargarDatosParaGrafico() {
    const registros = JSON.parse(localStorage.getItem('diario') || '[]');
    let p = 0, c = 0, g = 0;

    registros.forEach((reg: any) => {
      const f = reg.cantidadSeleccionada / 100;
      p += reg.proteinas * f;
      c += reg.carbohidratos * f;
      g += reg.grasas * f;
    });

    // Actualizamos los datos del gráfico
    this.pieChartData.datasets[0].data = [p, c, g];
  }
}
