import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cart } from '../models/cart';
import { Category } from '../models/category';
import { ShoppingItem } from '../models/shopping-item';
import { UserSpendings } from '../models/user-spendings'
import { UserSpendingsMonthly } from '../models/user-spendings-monthly';

@Injectable({
  providedIn: 'root'
})
export class CartlistServiceService {

  private apiBaseUrl = environment.apiBaseUrl;
  private cartlistUrl = `${this.apiBaseUrl}/api/cartlist`;
  private userSpendingsMonthUrl = `${this.apiBaseUrl}/api/cartlist/user-spendings-month`;
  private userSpendingsYearUrl = `${this.apiBaseUrl}/api/cartlist/user-spendings-year`;
  private userSpendingsMonthlyUrl = `${this.apiBaseUrl}/api/cartlist/user-spendings-monthly`;
  private deleteCartUrl = `${this.apiBaseUrl}/api/cartlist/delete`;
  private categoriesUrl = `${this.apiBaseUrl}/api/categories`;
  private addCartUrl = `${this.apiBaseUrl}/api/cartlist/add`;
  private updateCartUrl = `${this.apiBaseUrl}/api/cartlist/update`;
  private getCartByIdUrl = `${this.apiBaseUrl}/api/cartlist`;
  private shoppingItemsUrl = `${this.apiBaseUrl}/api/shoppinglist`;
  private deleteItemsUrl = `${this.apiBaseUrl}/api/shoppinglist/delete`;
  private addItemUrl = `${this.apiBaseUrl}/api/shoppinglist/add`;

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

  deleteCart(cartId: number): Observable<void> {
    const deleteCartUrl = `${this.deleteCartUrl}/${cartId}`;
    return this.http.delete<void>(deleteCartUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  addCart(cart: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.addCartUrl, cart);
  }

  updateCart(cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(this.updateCartUrl, cart);
  }

  getCartById(cartId: String): Observable<Cart> {
    return this.http.get<Cart>(`${this.getCartByIdUrl}/${cartId}`);
  }

  getSpendingsMonthly(): Observable<UserSpendingsMonthly[]> {
    return this.http.get<UserSpendingsMonthly[]>(this.userSpendingsMonthlyUrl);
  }

  getShoppingItems(): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(this.shoppingItemsUrl);
  }

  deleteItem(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteItemsUrl}/${itemId}`);
  }

  addItem(item: ShoppingItem): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(this.addItemUrl, item);
  }
}
