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

const routes: Routes = [
  { path: 'login', component: LoginFormularComponent},
  { path: 'budget-app/cartlist', component: CartlistComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/cartlist/add', component: CartFormularComponent, canActivate:[AuthGuardService]},
  { path: 'budget-app/cartlist/edit/:id', component: CartFormularComponent, canActivate:[AuthGuardService]},
  { path: '', redirectTo: '/budget-app/cartlist', pathMatch: 'full'},
  { path: '**', redirectTo: '/budget-app/cartlist', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginFormularComponent,
    CartlistComponent,
    CartFormularComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
