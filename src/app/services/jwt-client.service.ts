import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JwtClientService {

  private authUrl = `${environment.apiBaseUrl}/api/authenticate`;

  constructor(private http: HttpClient) { }


  authenticate(userName, password) {
    return this.http.post<any>(this.authUrl, {userName, password}).pipe(
      map(
        token => {
          sessionStorage.setItem('userName', userName);
          let tokenStr = "Bearer " + token.jwt;
          sessionStorage.setItem('token', tokenStr);
          return token;
        }
      )
    );
  }

  isUserLoggedIn() {
    const user = sessionStorage.getItem('userName');
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('userName');
  }
}
