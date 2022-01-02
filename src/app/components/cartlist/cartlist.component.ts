import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, SimpleChange, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { Cart } from 'src/app/models/cart';
import { UserSpendings } from 'src/app/models/user-spendings';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { UserSpendingsMonthly } from 'src/app/models/user-spendings-monthly';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.scss']
})
export class CartlistComponent implements OnInit {

  cartlist: Cart[] = [];
  userWithDeptMonth: UserSpendings[] = [];
  userWithDeptYear: UserSpendings[] = [];
  userSpendingsMonthly: UserSpendingsMonthly[] = [];
  months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  @ViewChild(BaseChartDirective) 
  private charts: QueryList<BaseChartDirective>;

  constructor(private router: Router, private route: ActivatedRoute, private cartService: CartlistServiceService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listCarts();
      this.getUserWithDeptMonth();
      this.getUserWithDeptYear();
      this.getMonthlySpendings();
    });

  }

  listCarts() {
    this.cartService.getCartlist().subscribe(
      data => {
        this.cartlist = data;
      }
    );
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

  getCurrentUser() {
    return sessionStorage.getItem('userName');
  }

  getCurrentMonth() {
    const today = new Date();
    return today.getMonth();
  }

  getCurrentYear() {
    const today = new Date();
    return today.getFullYear();
  }

  logOut() {
    sessionStorage.removeItem('userName');
    this.router.navigate(['login']);
  }

  onDelete(cartId: number, cartPrice: number) {
    if (confirm(`Delete Cart €${cartPrice}?`)) {
      this.cartService.deleteCart(cartId).subscribe(
        (data: void) => {
          this.ngOnInit();
          // window.location.reload(); // lädt die komplette Seite. Nicht optimal! Nur Chart soll aktualisiert werden
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ausgaben');

    worksheet.columns = [
      { header: 'Name', key: 'userName', width: 10 },
      { header: 'Beschreibung', key: 'description', width: 32 },
      { header: 'Datum', key: 'datePurchased', width: 10 },
      { header: 'Betrag', key: 'price', width: 10 },
      { header: 'Kategorie', key: 'categoryName', width: 10 },
    ];

    this.cartlist.forEach(cart => {
      worksheet.addRow({userName: cart.userName,
                        description: cart.description,
                        datePurchased: cart.datePurchased,
                        price: cart.price,
                        categoryName: cart.categoryName}, "n");
    })
 
    workbook.xlsx.writeBuffer().then((cartlist) => {
      let blob = new Blob([cartlist], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Ausgaben.xlsx');
    })
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
