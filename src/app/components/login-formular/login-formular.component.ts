import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtClientService } from 'src/app/services/jwt-client.service';

@Component({
  selector: 'app-login-formular',
  templateUrl: './login-formular.component.html',
  styleUrls: ['./login-formular.component.scss']
})
export class LoginFormularComponent implements OnInit {
  [x: string]: any; // index-signature for error in onSubmit-Method
  loginForm: FormGroup;
  invalidLogin = false;
  loginFail: boolean;

  constructor(private fb: FormBuilder, private router: Router, private jwtService: JwtClientService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get userName() {return this.loginForm.get('userName');}
  get password() {return this.loginForm.get('password');}

  onSubmit() {
    this.jwtService.authenticate(this.loginForm.value['userName'], this.loginForm.value['password']).subscribe(
      data => {
        this.router.navigate(['']);
        this.invalidLogin = false;
      },
      error => {
        this.invalidLogin = true;
        this.error = error.message;
      }
    )
  }

  loginFailed() {
    if (!sessionStorage.getItem('userName')) {
      return this.loginFail = true;
    }
    return this.loginFail = false;
  }

}
