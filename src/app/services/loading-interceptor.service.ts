import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService {

   // List of requests
   requests: HttpRequest<any>[] = [];

   constructor(private loadingService: LoadingService) { }
 
   removeRequest(req: HttpRequest<any>) {
     const index = this.requests.indexOf(req);
     if (index >= 0) {
       this.requests.splice(index, 1);
     }
     this.loadingService.isLoading.next(this.requests.length > 0);
   }
 
   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     if (request.url.includes('authenticate')) {
       this.requests.push(request);
       this.loadingService.isLoading.next(true);
     }
 
     return new Observable(observer => {
       const subscription = next.handle(request).subscribe(event => {
         if (event instanceof HttpResponse) {
           this.removeRequest(request);
           observer.next(event);
         }
       }, err => {
         this.removeRequest(request);
       })
     })
   }
}
