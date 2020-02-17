import { Component, OnInit, Input, EventEmitter, Output, Query } from '@angular/core';
import { TodoService } from '../shared/todoservice/todo.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})

export class TodoComponent implements OnInit {

  todos = [];
  title: string;
  showFilter: boolean;
  isComplete: boolean;
  priority: string;
  count: number;
  countToday: number;
  countOld: number;
  userId: string;

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

  deleteTask(todo: any) {
    const index = this.todos.indexOf(todo);
    if (!localStorage.getItem('userId')) {
      this.todos.splice(index, 1);
    } else {
      // delete from db here
      this.service.deleteTodo(todo);
    }
    this.count = this.todos.length;
  }

  markComplete(todo: any) {
    todo.isCompleted = !todo.isCompleted;
    this.isComplete = todo.isCompleted;
    const index = this.todos.indexOf(todo);
    this.todos.push(this.todos.splice(index, 1)[0]);
    if(localStorage.getItem('userId')) {
      this.service.markComplete();
    }
  }

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
        this.todos.push(todo);
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

  constructor(private service: TodoService, private db: AngularFireDatabase) {
    if (!localStorage.getItem('userId')) {
      this.todos = this.todos;
    } else {
      this.db.list('/todos').valueChanges()
        .subscribe(todos => {
          this.todos = todos;
          this.createdToday(this.todos);
          this.userId = this.service.userId;
          this.count = this.todos.length;
        });
    }
  }

  ngOnInit() {
  }
}
