import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { editTask } from '../../state/task.actions';
import { selectAllTasks } from '../../state/task.selectors';
import { Task } from '../../models/task.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {
  taskForm: FormGroup;
  task!: Task;

  constructor(private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Low', Validators.required]
    });
  }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    this.store.select(selectAllTasks).pipe(
      map(tasks => tasks.find(t => t.id === taskId))
    ).subscribe(task => {
      if (task) {
        this.task = task;
        this.taskForm.patchValue(task);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const updatedTask: Task = { ...this.task, ...this.taskForm.value };
      this.store.dispatch(editTask({ task: updatedTask }));
      this.taskForm.reset();
      this.router.navigate(['/']);
    }
  }
}
