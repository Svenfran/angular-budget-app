import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cart } from 'src/app/models/cart';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.scss']
})
export class CartlistComponent implements OnInit {

  cartlist: Cart[] = [];
  editCart: Cart;
  deleteCart: Cart;

  constructor(private route: ActivatedRoute, private cartService: CartlistServiceService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listCarts();
    });
  }

  listCarts() {
    this.cartService.getCartlist().subscribe(
      data => {
        this.cartlist = data;
        // console.log(this.cartlist);
      }
    );
  }

  getCurrentUser() {
    return sessionStorage.getItem('userName');
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
        this.ngOnInit();
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

}
