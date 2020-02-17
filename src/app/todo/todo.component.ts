import { Component, OnInit, Input, EventEmitter, Output, Query } from '@angular/core';
import { TodoService } from '../shared/todoservice/todo.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../shared/authservice/auth.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})

export class TodoComponent implements OnInit {

  todos: any[];
  title: string;
  showFilter: boolean;
  //isComplete: boolean;
  priority: string;
  count: number;
  countToday: number;
  countOld: number;
  userId: string;
  $key: string;
  loggedIn: boolean;

  getColorClass(priority: string) {
    let color;
    switch (priority) {
    case 'high':
      color = '#FF5959';
      break;
    case 'medium':
      color = '#F5A622';
      break;
    case 'low':
      color = '#51D266';
      break;
    default:
      color = 'white';
    }
    return color;
  }

  // // deleteTask(todo: any) {
  // //   const index = this.todos.indexOf(todo);
  // //   if (!localStorage.getItem('userId')) {
  // //     this.todos.splice(index, 1);
  // //   } else {
  // //     // delete from db here
  // //     this.service.deleteTodo();
  // //   }
  // //   this.count = this.todos.length;
  // // }

  // markComplete(todo, key, isCompleted) {
  //   todo.isCompleted = !todo.isCompleted;
  //   //this.isComplete = todo.isCompleted;

  //   if(localStorage.getItem('userId')) {
  //     this.service.markComplete(key, isCompleted);
  //   } else {
  //     const index = this.todos.indexOf(todo);
  //     this.todos.push(this.todos.splice(index, 1)[0]);
  //   }
  // }

  onKeyPress(title: string) {
    if (title.length > 0) {
      this.showFilter = true;
    } else {
      this.showFilter = false;
      this.priority = '';
    }
  }

  onKeyUp(title) {
    if (title !== '' && title !== undefined) {
      const todo = {
        title: this.title,
        priority: this.priority,
        isCompleted: false,
        dateCreated: new Date(),
        userId: ''
      };
      if (!localStorage.getItem('userId')) {
        const todoArr = [];
        todoArr.push(todo);
        this.todos = todoArr;
      } else {
        todo.userId = localStorage.getItem('userId');
        this.service.createTodo(todo)
        .subscribe(res => {
        });
      }

      this.title = '';
      this.showFilter = false;
      this.priority = '';
      this.count = this.todos.length;
    }
  }

  createdToday(todos) {
    let num = 0;
    let numOld = 0;
    let count = this.todos.map((obj) => {
      const todoD = new Date(obj.dateCreated).getDate();
      const currentD = new Date().getDate();
      if (todoD === currentD) {
        num++;
      } else {
        numOld++;
      }
      this.countToday = num;
      this.countOld = numOld;
    });
  }

  onPrioritySelect(event) {
    this.priority = event.target.value;
  }

  constructor(public service: TodoService, private db: AngularFireDatabase, public authService: AuthService) {}

  ngOnInit() {
    if (!localStorage.getItem('userId')) {
      this.todos = this.todos;
    } else {
      this.db.list('/todos').snapshotChanges()
        .subscribe(todo => {
          this.todos = [];
          todo.forEach(e => {
            const x = e.payload.toJSON();
            const keyVar = '$key';
            x[keyVar] = e.key;
            this.todos.push(x);
          });
          //this.todos = todos;
          this.createdToday(this.todos);
          this.userId = this.service.userId;
          this.count = this.todos.length;
        });
    }
  }
}
