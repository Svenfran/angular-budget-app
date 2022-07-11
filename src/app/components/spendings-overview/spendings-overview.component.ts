import { CurrencyPipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
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
  userDeptMonth: UserDept[] = [];
  userDeptYear: UserDept[] = [];
  sumS: string;
  sumM: string;
  sumTotal: string;

  cssSven = {
    'color': this.colorSven,
    'font-weight':'600'
  }
  cssMontse = {
    'color': this.colorMontse,
    'font-weight':'600'
  }



  constructor(private router: Router, private route: ActivatedRoute, 
              private cartService: CartlistServiceService, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      // this.getUserWithDeptMonth();
      this.getUserWithDeptMonth2();
      // this.getUserWithDeptYear();
      this.getUserWithDeptYear2();
      this.getMonthlySpendings();
    });
  }

  getUserWithDeptMonth() {
    this.cartService.getUserSpendingsMonth().subscribe(
      data => {
        this.userWithDeptMonth = data.filter(e => e.diff < 0);
        // console.log("userWithDeptMonth: ")
        // console.log(this.userWithDeptMonth);
      }
    );
  }
  
  getUserWithDeptYear() {
    this.cartService.getUserSpendingsYear().subscribe(
      data => {
        this.userWithDeptYear = data.filter(e => e.diff < 0);
        // console.log("userDeptYear:");
        // console.log(this.userWithDeptYear);
      }
    );
  }

  getUserWithDeptYear2() {
    let user = new UserDept();
    let sumS: number = 0;
    let sumM: number = 0;
    let totalS: number = 0;
    let totalM: number = 0;
    let total: number = 0;

    this.cartService.getSpendingsMonthly().subscribe(
      data => {

        if (data.length == 0) {
          user.diff = 0;
          user.userName = "none";
          user.msg = "keine Ausgaben bisher."
        } else {

          for (let i = 0; i < data.length; i++) {
            if (data[i].month <= (this.getCurrentMonth() + 1)) {
              sumM += data[i].diffMontse;
              sumS += data[i].diffSven;
              totalM += data[i].sumMontse;
              totalS += data[i].sumSven;
            }
          }
  
          if (sumM < 0) {
            user.diff = sumM;
            user.userName = Object.keys(data[0])[1].substring(3).toLowerCase();
          } else if (sumS < 0) {
            user.diff = sumS;
            user.userName = Object.keys(data[0])[0].substring(3).toLowerCase();
          } else if (sumS == 0 && sumM == 0) {
            user.diff = 0;
            user.userName = "balanced";
          }
        }
        user.totalM = totalM;
        user.totalS = totalS;
        user.total = totalM + totalS;

        // console.log("userDeptYear2:");
        // console.log(this.userDeptYear);
        this.userDeptYear.push(user);
      }
    );
  }

  getUserWithDeptMonth2() {
    let user = new UserDept();
    
    this.cartService.getSpendingsMonthly().subscribe(
      data => {

        const checkMonthExistence = dataParam => data.some( ({month}) => month == dataParam)

        if (!checkMonthExistence(this.getCurrentMonth() + 1)) {
          user.diff = 0;
          user.userName = "none";
          user.msg = "keine Ausgaben bisher."
        } else {
          
          for (let i = 0; i < data.length; i++) {
            if (data[i].month == (this.getCurrentMonth() + 1)) {
              if (data[i].diffMontse < 0) {
                user.diff = data[i].diffMontse;
                user.userName = Object.keys(data[i])[1].substring(3).toLowerCase();
              } else if (data[i].diffSven < 0) {
                user.diff = data[i].diffSven;
                user.userName = Object.keys(data[i])[0].substring(3).toLowerCase();
              } else if (data[i].diffMontse == 0 && data[i].diffSven == 0) {
                user.diff = 0;
                user.userName = "balanced";
              } 
            }
          }
        }

        // console.log("userDeptMonth:");
        // console.log(this.userDeptMonth);
        this.userDeptMonth.push(user);
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
          if (data[i].month == this.getCurrentMonth() + 1) {
            chartSpendingsMonth.push(parseFloat(data[i].sumMontse.toFixed(2)));
            chartSpendingsMonth.push(parseFloat(data[i].sumSven.toFixed(2)));
          }
          
          if (data[i].month <= this.getCurrentMonth() + 1) {
            sumM += data[i].sumMontse;
            sumS += data[i].sumSven;
          }
        }
        chartUserNames.push(Object.keys(data[0])[1].substring(3)); // Montse
        chartUserNames.push(Object.keys(data[0])[0].substring(3)); // Sven
        chartSpendingsYear.push(parseFloat(sumM.toFixed(2)));
        chartSpendingsYear.push(parseFloat(sumS.toFixed(2)));
        
      }
    )
    // console.log(chartUserNames);
    // console.log(chartSpendingsMonth);
    // console.log(chartSpendingsYear);
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

  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ausgaben');

    worksheet.columns = [
      { header: 'Jahr', key: 'year', width: 10 },
      { header: 'Monat', key: 'month', width: 10 },
      { header: 'Sven', key: 'sumSven', width: 10 },
      { header: 'Montse', key: 'sumMontse', width: 10 },
      { header: 'Diff-Sven', key: 'diffSven', width: 10 },
      { header: 'Diff-Montse', key: 'diffMontse', width: 10 },
      { header: 'Gesamt', key: 'total', width: 10 },
    ];

    this.userSpendingsMonthly.forEach(month => {
      worksheet.addRow({year: this.getCurrentYear(),
                        month: this.months[month.month - 1],
                        sumSven: parseFloat(month.sumSven.toFixed(2)),
                        sumMontse: parseFloat(month.sumMontse.toFixed(2)),
                        diffSven: parseFloat(month.diffSven.toFixed(2)),
                        diffMontse: parseFloat(month.diffMontse.toFixed(2)),
                        total: parseFloat(month.total.toFixed(2))}, "n");
    })
 
    workbook.xlsx.writeBuffer().then((cartlist) => {
      let blob = new Blob([cartlist], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ausgaben_Monat.xlsx');
    })
  }

  //-----Charts-----------
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
    responsive: true,
    cutoutPercentage: '90',
    legend: false,
    // legend: { position: 'bottom' },
    title: { display: true, text: 'Jan - ' + this.months[this.getCurrentMonth()].substring(0, 3) + " " + this.getCurrentYear() }
  };

}

class UserDept {
  userName: string;
  diff: number;
  msg: string;
  totalS: number;
  totalM: number;
  total: number;
}