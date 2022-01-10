import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShoppingItem } from 'src/app/models/shopping-item';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {

  shoppingItems: ShoppingItem[] = [];
  shoppingItemForm: FormGroup;
  reqSuccess: boolean;

  constructor(private cartService: CartlistServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.shoppingItemForm = this.fb.group({
      description:[''],
      isCompleted:['']
    })
    this.getShoppingItems();
  }

  getShoppingItems() {
    this.cartService.getShoppingItems().subscribe(
      data => {
        this.shoppingItems = data;
      }
    )
  }

  onDelete(itemId: number) {
    this.cartService.deleteItem(itemId).subscribe(
      (data: void) => {
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  onSubmit() {
    this.cartService.addItem(this.shoppingItemForm.value).subscribe(
      response => {
        this.reqSuccess = true;
        this.shoppingItemForm.reset();
        this.ngOnInit();
      },
      error => {
        this.reqSuccess = false;
      }
    )
  }

}
