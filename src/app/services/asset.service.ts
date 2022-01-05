import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Asset } from '../models/asset';

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private apiBaseUrl = environment.apiBaseUrl;
  private assetUrl = `${this.apiBaseUrl}/api/assets`;

  constructor(private http: HttpClient) { }


  getAssets(): Observable<Asset[]> {
    return this.http.get<Asset[]>(this.assetUrl);
  }

}
