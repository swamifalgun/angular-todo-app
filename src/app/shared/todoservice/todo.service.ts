import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})

export class TodoService { 

  private url = 'https://slush-todo.firebaseio.com/todos.json';
  userId: string;
  user;

  constructor(private db: AngularFireDatabase, private http: Http, private firestore: AngularFirestore ) {}

  deleteTodo(todo) {
  }


  createTodo(todo) {
    return this.http.post(this.url, JSON.stringify(todo));
  }

  getUserId(userId) {
    console.log('User from todo service ', userId);
    this.userId = userId;
  }

  getCurrentUser(user) {
    console.log('User object coming from todo service' , user);
    this.user = user;
  }
}
