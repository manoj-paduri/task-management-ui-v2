import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { selectAllTasks } from '../../state/task.selectors';
import { deleteTask, toggleTaskCompletion } from '../../state/task.actions';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks$: Observable<Task[]>;
  filteredTasks!: Task[];
  taskStatusFilter: 'All' | 'Completed' | 'Pending' = 'All';
  taskPriorityFilter: 'All' | 'Low' | 'Medium' | 'High' = 'All';
  private tasksSubscription!: Subscription;

  constructor(private store: Store) {
    this.tasks$ = this.store.select(selectAllTasks);

    this.tasksSubscription = this.tasks$
      .pipe(
        map(tasks => this.filterTasks(tasks))
      )
      .subscribe(filteredTasks => {
        this.filteredTasks = filteredTasks;
      });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  onDeleteTask(id: string): void {
    this.store.dispatch(deleteTask({ id }));
  }

  onToggleCompletion(id: string): void {
    this.store.dispatch(toggleTaskCompletion({ id }));
  }

  applyFilters(): void {
    this.tasks$.pipe(
      map(tasks => this.filterTasks(tasks))
    ).subscribe(filteredTasks => {
      this.filteredTasks = filteredTasks;
    });
  }

  resetFilters(): void {
    this.taskStatusFilter = 'All';
    this.taskPriorityFilter = 'All';
    this.applyFilters();
  }

  sortByDueDate(): void {
    this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  }

  sortByPriority(): void {
    const priorityOrder = { Low: 1, Medium: 2, High: 3 };
    this.filteredTasks = [...this.filteredTasks].sort((a, b) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private filterTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => {
      const statusCondition = this.taskStatusFilter === 'All' || (this.taskStatusFilter === 'Completed' && task.completed) || (this.taskStatusFilter === 'Pending' && !task.completed);
      const priorityCondition = this.taskPriorityFilter === 'All' || task.priority === this.taskPriorityFilter;
      return statusCondition && priorityCondition;
    });
  }
}
