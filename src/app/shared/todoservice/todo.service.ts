import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore } from '@angular/fire/firestore'; 

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private url = 'https://slush-todo.firebaseio.com/todos.json';

  constructor(private http: Http, private firestore: AngularFirestore ) {}

  getTodos() {
    return this.http.get(this.url);
  }

  createTodo(todo) {
    return this.http.post(this.url, JSON.stringify(todo));
  }

}
