import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/authservice/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  signIn: boolean;
  email: string;
  password: string;
  invalidLogin: boolean;
  userId: string;

  constructor(public authService: AuthService) {}

  authMode() {
    this.signIn = !this.signIn;
  }

  login(email, password, signIn) {
    this.email = email.value;
    this.password = password.value;

    if (signIn) {
      this.authService.SignIn(String(this.email), String(this.password));

    } else {
      this.authService.SignUp(this.email, this.password);
    }
  }
  ngOnInit() {}
}
