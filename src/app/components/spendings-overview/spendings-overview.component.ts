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


  constructor(private router: Router, private route: ActivatedRoute, private cartService: CartlistServiceService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.getUserWithDeptMonth();
      this.getUserWithDeptYear();
      this.getMonthlySpendings();
    });

  }

  getUserWithDeptMonth() {
    this.cartService.getUserSpendings().subscribe(
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

  getChartDataMonth() {
    const chartUserNames: string[] = [];
    const chartSpendings: number[] = [];

    this.cartService.getUserSpendings().subscribe(
      data => {
        for (let i = 0; i < data.length; i++) {
          chartUserNames.push(this.capitalize(data[i].userName));
          chartSpendings.push(parseFloat(data[i].sumAmount.toFixed(2)));
        };
      }
    )
    return { chartUserNames, chartSpendings };
  }

  getChartDataYear() {
    const chartUserNames: string[] = [];
    const chartSpendings: number[] = [];

    this.cartService.getUserSpendingsYear().subscribe(
      data => {
        for (let i = 0; i < data.length; i++) {
          chartUserNames.push(this.capitalize(data[i].userName));
          chartSpendings.push(parseFloat(data[i].sumAmount.toFixed(2)));
        };
      }
    )  
    return { chartUserNames, chartSpendings };
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
  public doughnutChartLabels = this.getChartDataMonth().chartUserNames;
  public doughnutChartData = this.getChartDataMonth().chartSpendings;
  public doughnutChartType = 'doughnut';
  public doughnutChartColors: Array<any> = [
    {
      backgroundColor: ['#8e5ea2', '#5da7d5'],
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
  public doughnutChartLabelsYear = this.getChartDataYear().chartUserNames;
  public doughnutChartDataYear = this.getChartDataYear().chartSpendings;
  public doughnutChartTypeYear = 'doughnut';
  public doughnutChartColorsYear: Array<any> = [
    {
      backgroundColor: ['#8e5ea2', '#5da7d5'],
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
