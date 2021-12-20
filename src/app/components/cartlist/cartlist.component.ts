import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from 'src/app/models/cart';
import { CartlistServiceService } from 'src/app/services/cartlist-service.service';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.scss']
})
export class CartlistComponent implements OnInit {

  cartlist: Cart[] = [];

  constructor(private router: Router, private route: ActivatedRoute, private cartService: CartlistServiceService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listCarts();
    });
  }

  listCarts() {
    this.cartService.getCartlist().subscribe(this.processResult());
  }

  processResult() {
    return data => {
      this.cartlist = data;
    };
  }

  getCurrentUser() {
    return sessionStorage.getItem('userName');
  }

  logOut() {
    sessionStorage.removeItem('userName');
    this.router.navigate(['login']);
  }
}
