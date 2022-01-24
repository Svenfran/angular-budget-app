import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  shoppingItem: ShoppingItem;

  constructor(private route: ActivatedRoute, private cartService: CartlistServiceService, 
              private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.shoppingItemForm = this.fb.group({
      description:['' ,[Validators.required]],
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

  deleteList() {
    for (let i = 0; i < this.shoppingItems.length; i++) {
      if (this.shoppingItems[i].completed) {
        this.onDelete(+this.shoppingItems[i].id);
      }
    }
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
    if (this.shoppingItemForm.invalid) {
      this.shoppingItemForm.markAllAsTouched();
      return;
    }
    this.createItem();
  }

  createItem() {
    this.cartService.addItem(this.shoppingItemForm.value).subscribe(
      response => {
        this.reqSuccess = true;
        this.shoppingItemForm.reset();
        this.ngOnInit();
      },
      error => {
        this.reqSuccess = false;
      }
    );
  }

  // mark Item as done!
  updateItem(shoppingItem) {

    shoppingItem.completed = !shoppingItem.completed;

    this.cartService.updateItem(shoppingItem).subscribe(
      response => {
        this.reqSuccess = true;
        this.ngOnInit();
      },
      error => {
        this.reqSuccess = false;
      }
    );
  }


  get description() {
    return this.shoppingItemForm.get('description');
  }

}
