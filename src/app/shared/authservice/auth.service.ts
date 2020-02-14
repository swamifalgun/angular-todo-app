import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import axios from 'axios';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  invalidLogin: boolean;
  errorMsg: string;
  private user: firebase.User;
  userId;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  SignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(String(email), String(password))
      .then((result) => {
        this.userId = result.user.uid;
      }).catch((error) => {
        this.invalidLogin = true;
        this.errorMsg = error.message;
      });
  }

  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(String(email), String(password))
      .then((result) => {
          this.userId = String(result.user.uid);
          this.router.navigate(['/']);
      }).catch((error) => {
        this.invalidLogin = true;
        this.errorMsg = error.message;
      });
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

}


