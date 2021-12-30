import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';

@Component({
  selector: 'app-cart-formular',
  templateUrl: './cart-formular.component.html',
  styleUrls: ['./cart-formular.component.scss']
})
export class CartFormularComponent implements OnInit {

  cartForm: FormGroup;
  emptyField = "Pflichtfeld!";
  categories: Category[] = [];
  reqSuccess: boolean;
  isAddMode: boolean;
  cartId: String;

  constructor(private fb: FormBuilder, private cartService: CartlistServiceService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cartForm = this.fb.group({
      id:[''],
      description: ['',[ Validators.required ]],
      price: ['',[ Validators.required ]],
      datePurchased: ['',[ Validators.required, Validators.pattern('(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}')]],
      categoryName: ['',[ Validators.required ]],
    })
    this.getCategories();

    this.cartId = this.route.snapshot.params['id'];
    this.isAddMode = !this.cartId;
    
    if (!this.isAddMode) {
      this.cartService.getCartById(this.cartId)
      .pipe(first())
      .subscribe(data => this.cartForm.patchValue(data));
    }
  }

  onSubmit() {
    if (this.cartForm.invalid) {
      this.cartForm.markAllAsTouched();
      return;
    }
    
    if (this.isAddMode) {
      this.createCart();
    } else {
      this.updateCart();
    }
  }

  createCart() {
    this.cartService.addCart(this.cartForm.value).subscribe(
      response => {
        this.reqSuccess = true;
        console.log("Success!", response);
        this.router.navigate(['budget-app/cartlist']);
      },
      error => {
        this.reqSuccess = false;
        console.log("Error!", error);
      }
    );
  }

  updateCart() {
    this.cartService.updateCart(this.cartForm.value).subscribe(
      response => {
        this.reqSuccess = true;
        console.log("Success!", response);
        this.router.navigate(['budget-app/cartlist']);
      },
      error => {
        this.reqSuccess = false;
        console.log("Error!", error);
      }
    );
  }

  loadData() {
    console.log("Load Data!!")
  }

  getCategories() {
    this.cartService.getCategories().subscribe(
      data => {
        this.categories = data;
      }
    );
  }

  get description() {return this.cartForm.get('description');}
  get price() {return this.cartForm.get('price');}
  get datePurchased() {return this.cartForm.get('datePurchased');}
  get categoryName() {return this.cartForm.get('categoryName');}
}