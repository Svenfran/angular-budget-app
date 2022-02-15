import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { CartlistComponent } from './components/cartlist/cartlist.component';
import { LoginFormularComponent } from './components/login-formular/login-formular.component';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthHttpInterceptorService } from './services/auth-http-interceptor.service';
import { ChartsModule } from 'ng2-charts';
import { CartFormularComponent } from './components/cart-formular/cart-formular.component';
import { SpendingsOverviewComponent } from './components/spendings-overview/spendings-overview.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { LoadingInterceptorService } from './services/loading-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { AssetlistComponent } from './components/assetlist/assetlist.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';

const routes: Routes = [
  { path: 'login', component: LoginFormularComponent},
  { path: 'budget-app/spendings', component: SpendingsOverviewComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/spendings/add', component: CartFormularComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/spendings/edit/:id', component: CartFormularComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/cartlist', component: CartlistComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/assetlist', component: AssetlistComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/shoppinglist', component: ShoppingListComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/shoppinglist/add', component: ShoppingListComponent, canActivate:[AuthGuardService]},
  { path: '', redirectTo: '/budget-app/spendings', pathMatch: 'full'},
  { path: '**', redirectTo: '/budget-app/spendings', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginFormularComponent,
    CartlistComponent,
    CartFormularComponent,
    SpendingsOverviewComponent,
    FooterComponent,
    LoadingComponent,
    AssetlistComponent,
    ShoppingListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule,
    BrowserAnimationsModule
  ],
  providers: [DatePipe, CurrencyPipe, {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptorService, multi: true},
              {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
