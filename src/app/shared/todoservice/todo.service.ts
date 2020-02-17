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

  todoList: AngularFireList<any>;

  constructor(private db: AngularFireDatabase, private http: Http, private firestore: AngularFirestore ) {}


  getTodos() {
    this.todoList = this.db.list('todos');
    return this.todoList;
  }

  deleteTodo($key: string) {
    this.db.object('/todos/' + $key).remove();
  }

  markComplete($key: string, flag: boolean) {
    this.db.object('/todos/' + $key)
      .update({isCompleted : !flag});
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
