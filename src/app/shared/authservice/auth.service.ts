import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs';
import { TodoService } from '../todoservice/todo.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  invalidLogin: boolean;
  errorMsg: string;
  private user: firebase.User;
  userId: string;

  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router, private todoService: TodoService) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  isLoggedIn(): boolean {
    return !!this.user;
  }

  SignUp(email: string, password: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(String(email), String(password))
      .then((result) => {
        this.userId = result.user.uid;
        localStorage.setItem('userId', this.userId);
        this.todoService.getUserId(result.user.uid);
      }).catch((error) => {
        this.invalidLogin = true;
        this.errorMsg = error.message;
      });
  }

  SignIn(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(String(email), String(password))
      .then((result) => {
          this.userId = String(result.user.uid);
          localStorage.setItem('userId', this.userId);
          this.todoService.getUserId(this.userId);
          this.router.navigate(['/']);
      }).catch((error) => {
        this.invalidLogin = true;
        this.errorMsg = error.message;
      });
  }

  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('userId');
      this.router.navigate(['/login']);
    });
  }

}


