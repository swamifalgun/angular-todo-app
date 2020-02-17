import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Subscriber } from 'rxjs';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class TodoService {


  private url = 'https://slush-todo.firebaseio.com/todos.json';
  userId: string;
  user;
  key;
  completed: boolean;

  constructor(private db: AngularFireDatabase, private http: Http, private firestore: AngularFirestore ) {}

  deleteTodo(todo) {
    //const todoList = this.db.list('todos').valueChanges();
    this.db.database.ref('/todos').on('value', snapshot => {
      const arr = snapshot.val();
      if (arr) {
        const arr2 = Object.keys(arr);
        const key = arr2[0];
        console.log(key);
        this.key = key;
      }
    });
    const todoRef = this.db.database.ref('todos/' + this.key);
    todoRef.remove();
  }

  markComplete() {
    this.db.database.ref('/todos').on('value', snapshot => {
      const arr = snapshot.val();
      if (arr) {
        const arr2 = Object.keys(arr);
        const key = arr2[0];
        console.log(key);
        this.key = key;
      }
    });
    const todoRefUpdate = this.db.database.ref('todos/' + this.key);
    todoRefUpdate.once('value').then(snapShot => {
      const completed = snapShot.val().isCompleted;
      console.log(completed);
      this.completed = completed;
      console.log(this.completed);
    });
    todoRefUpdate.update({isCompleted : !this.completed});
  }

  createTodo(todo) {
    return this.http.post(this.url, JSON.stringify(todo));
  }

  getUserId(userId) {
    this.userId = userId;
  }

  getCurrentUser(user) {
    this.user = user;
  }
}
