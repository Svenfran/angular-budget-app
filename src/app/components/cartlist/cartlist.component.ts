import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart } from 'src/app/models/cart';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.scss']
})
export class CartlistComponent implements AfterViewInit {

  cartlist: Cart[] = [];
  editCart: Cart;
  deleteCart: Cart;
  filterMode: boolean;
  sumPrice: number;
  category: string;
  today = new Date();

  constructor(private route: ActivatedRoute, private cartService: CartlistServiceService,
              private currencyPipe: CurrencyPipe) { }

  ngAfterViewInit() {
    this.route.paramMap.subscribe(() => {
      this.listCarts();
    });
    setTimeout(() => {
      this.sumTableRows()
    }, 1000)
  };

  listCarts() {
    this.cartService.getCartlist().subscribe(
      data => {
        this.cartlist = data;
        // get only carts for current year
        // this.cartlist = data.filter(e => e.datePurchased.substring(6) == this.getCurrentYear().toString());
        // console.log(this.cartlist);
      }
    );
  }

  getCurrentUser() {
    return sessionStorage.getItem('userName');
  }

  getCurrentYear() {
    return this.today.getFullYear();
  }

  // onDelete(cartId: number, cartPrice: number, cartDescription: string) {
  //   if (confirm(`${cartDescription} - €${cartPrice} löschen?`)) {
  //     this.cartService.deleteCart(cartId).subscribe(
  //       (data: void) => {
  //         this.ngOnInit();
  //       },
  //       (error: HttpErrorResponse) => {
  //         alert(error.message);
  //       }
  //     );
  //   }
  // }

  onDelete(cartId: number) {
    this.cartService.deleteCart(cartId).subscribe(
      (data: void) => {
        this.ngAfterViewInit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Ausgaben');

    worksheet.columns = [
      { header: 'Jahr', key: 'year', width: 10 },
      { header: 'Name', key: 'userName', width: 10 },
      { header: 'Beschreibung', key: 'description', width: 32 },
      { header: 'Datum', key: 'datePurchased', width: 10 },
      { header: 'Betrag', key: 'price', width: 10 },
      { header: 'Kategorie', key: 'categoryName', width: 10 },
    ];

    this.cartlist.forEach(cart => {
      worksheet.addRow({year: parseInt(cart.datePurchased.slice(6)),
                        userName: cart.userName,
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

  // change button type from submit to button
  public onOpenModal(cart: Cart, mode: string): void {
    const container = document.getElementById("main-container")
    const button = document.createElement("button");
    button.type = "button";
    button.style.display = "none";
    button.setAttribute("data-toggle", "modal");

    // if (mode === "add") {
    //   button.setAttribute("data-target", "#addCartModal");
    // }
    // if (mode === "edit") {
    //   this.editCart = cart;
    //   button.setAttribute("data-target", "#updateCartModal");
    // }
    if (mode === "delete") {
      this.deleteCart = cart;
      button.setAttribute("data-target", "#deleteCartModal");
    }

    container.appendChild(button);
    button.click();
  }

  filterCategory(categoryName: string) {
    if (!this.filterMode) {
      this.filter(categoryName);
    } else {
      this.showAll();
    }
    this.sumTableRows();
  }

  filter(categoryName: string) {
    let filter, table, tr, td, i, txtValue
    filter = categoryName.toUpperCase();
    table = document.querySelector(".table");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
    this.filterMode = true;
  }

  showAll() {
    let table, tr, i
    table = document.querySelector(".table");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = "";
    }
    this.filterMode = false;
  }

  sumTableRows() {
    let table, tds, trs;
    let cat: string[] = [];
    let sum = 0;
    
    table = document.querySelector(".table");
    trs = table.getElementsByTagName("tr");
    tds = table.getElementsByTagName("td");
    
    for (let i = 1; i < trs.length; i++) {
      if (trs[i].style.display != "none") {
        sum += parseFloat(trs[i].cells[6].innerHTML.replace("&nbsp;€", "").replace(".", "").replace(",", "."));
        // console.log(trs[i].cells[6].innerHTML.replace("&nbsp;€", "").replace(".", "").replace(",", "."));
        cat.push(trs[i].cells[2].innerHTML);
      }
    }
    this.category = this.filterMode ? cat[0] : 'Gesamt';
    this.sumPrice = sum;
  }


}
