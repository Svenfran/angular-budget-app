import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = new BehaviorSubject(false);
  loadingStatus: boolean; 

  constructor() { 
    this.isLoading.subscribe((status: boolean) => 
    this.loadingStatus = status);
  }
}
