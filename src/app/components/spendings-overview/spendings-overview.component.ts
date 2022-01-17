import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserSpendings } from 'src/app/models/user-spendings';
import { UserSpendingsMonthly } from 'src/app/models/user-spendings-monthly';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';

@Component({
  selector: 'app-spendings-overview',
  templateUrl: './spendings-overview.component.html',
  styleUrls: ['./spendings-overview.component.scss']
})
export class SpendingsOverviewComponent implements OnInit {

  userWithDeptMonth: UserSpendings[] = [];
  userWithDeptYear: UserSpendings[] = [];
  userSpendingsMonthly: UserSpendingsMonthly[] = [];
  months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  today = new Date();
  colorSven = '#5da7d5';
  colorMontse = '#8e5ea2';


  constructor(private router: Router, private route: ActivatedRoute, private cartService: CartlistServiceService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.getUserWithDeptMonth();
      this.getUserWithDeptYear();
      this.getMonthlySpendings();
    });
  }

  getUserWithDeptMonth() {
    this.cartService.getUserSpendingsMonth().subscribe(
      data => {
        this.userWithDeptMonth = data.filter(e => e.diff < 0);
      }
    );
  }
  
  getUserWithDeptYear() {
    this.cartService.getUserSpendingsYear().subscribe(
      data => {
        this.userWithDeptYear = data.filter(e => e.diff < 0);
      }
    );
  }
  
  getMonthlySpendings() {
    this.cartService.getSpendingsMonthly().subscribe(
      data => {
        this.userSpendingsMonthly = data.filter(e => e.month <= (this.getCurrentMonth() + 1))
        // console.log(this.userSpendingsMonthly);
      }
    );
  }

  getChartData() {
    const chartUserNames: string[] = [];
    const chartSpendingsMonth: number[] = [];
    const chartSpendingsYear: number[] = [];
    let sumS: number = 0;
    let sumM: number = 0;

    this.cartService.getSpendingsMonthly().subscribe(
      data => {
        for (let i = 0; i < data.length; i++) {
          // console.log(Object.keys(data[i])[0].substring(3))
          // console.log(Object.keys(data[i])[1].substring(3))
          if (data[i].month == this.getCurrentMonth() + 1) {
            chartSpendingsMonth.push(parseFloat(data[i].sumMontse.toFixed(2)));
            chartSpendingsMonth.push(parseFloat(data[i].sumSven.toFixed(2)));
            chartUserNames.push(Object.keys(data[i])[1].substring(3)); // Montse
            chartUserNames.push(Object.keys(data[i])[0].substring(3)); // Sven
          } 
          if (data[i].month <= this.getCurrentMonth() + 1) {
            sumM += data[i].sumMontse;
            sumS += data[i].sumSven;
            chartSpendingsYear.push(parseFloat(sumM.toFixed(2)));
            chartSpendingsYear.push(parseFloat(sumS.toFixed(2)));
          }
        }  
      }
    )
    return { chartUserNames, chartSpendingsMonth, chartSpendingsYear };
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getCurrentMonth() {
    return this.today.getMonth();
  }

  getCurrentYear() {
    return this.today.getFullYear();
  }


  //-----Charts-----------
  // Month
  public doughnutChartLabels = this.getChartData().chartUserNames;
  public doughnutChartData = this.getChartData().chartSpendingsMonth;
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: Array<any> = [
    {
      backgroundColor: [this.colorMontse, this.colorSven],
      borderWidth: 0
    }
  ];

  public doughnutChartOptions: any = {
    responsive: false,
    cutoutPercentage: '85',
    legend: false,
    // legend: { position: 'bottom' },
    title: { display: true, text: this.months[this.getCurrentMonth()] + " " + this.getCurrentYear()}
  };

  // Year
  public doughnutChartLabelsYear = this.getChartData().chartUserNames;
  public doughnutChartDataYear = this.getChartData().chartSpendingsYear;
  public doughnutChartTypeYear = 'doughnut';
  public doughnutChartColorsYear: Array<any> = [
    {
      backgroundColor: [this.colorMontse, this.colorSven],
      borderWidth: 0
    }
  ];

  public doughnutChartOptionsYear: any = {
    responsive: false,
    cutoutPercentage: '85',
    legend: false,
    // legend: { position: 'bottom' },
    title: { display: true, text: 'Jan - ' + this.months[this.getCurrentMonth()].substring(0, 3) + " " + this.getCurrentYear() }
  };

}
