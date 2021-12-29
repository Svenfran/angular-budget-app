import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { UserSpendings } from '../models/user-spendings'

@Injectable({
  providedIn: 'root'
})
export class CartlistServiceService {

  private apiBaseUrl = environment.apiBaseUrl;
  private cartlistUrl = `${this.apiBaseUrl}/api/cartlist`;
  private userSpendingsMonthUrl = `${this.apiBaseUrl}/api/cartlist/user-spendings-month`;
  private userSpendingsYearUrl = `${this.apiBaseUrl}/api/cartlist/user-spendings-year`;

  constructor(private http: HttpClient) { }

  getCartlist(): Observable<Cart[]> {
    return this.http.get<Cart[]>(this.cartlistUrl);
  }

  getUserSpendings(): Observable<UserSpendings[]> {
    return this.http.get<UserSpendings[]>(this.userSpendingsMonthUrl);
  }
  
  getUserSpendingsYear(): Observable<UserSpendings[]> {
    return this.http.get<UserSpendings[]>(this.userSpendingsYearUrl);
  }
}
