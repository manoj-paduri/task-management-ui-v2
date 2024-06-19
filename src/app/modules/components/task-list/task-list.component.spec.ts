import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './task-list.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Task } from '../../models/task.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

fdescribe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let store: MockStore;

  const initialState = {
    tasks: [
      { id: '1', title: 'Test Task 1', description: 'Description 1', dueDate: new Date('2024-07-01'), priority: 'Low', completed: false },
      { id: '2', title: 'Test Task 2', description: 'Description 2', dueDate: new Date('2024-06-01'), priority: 'High', completed: true },
      { id: '3', title: 'Test Task 3', description: 'Description 3', dueDate: new Date('2024-08-01'), priority: 'Medium', completed: false }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        BrowserAnimationsModule,
        FormsModule,
        MatToolbarModule,
        MatIconModule
      ],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter tasks correctly', () => {
    component.taskStatusFilter = 'Completed';
    component.applyFilters();
    expect(component.filteredTasks?.length).toBe(1);
    expect(component.filteredTasks[0].title).toBe('Test Task 2');

    component.taskStatusFilter = 'Pending';
    component.applyFilters();
    expect(component.filteredTasks.length).toBe(2);
    expect(component.filteredTasks[0].title).toBe('Test Task 1');
    expect(component.filteredTasks[1].title).toBe('Test Task 3');
  });

  it('should sort tasks by due date correctly', () => {
    component.sortByDueDate();
    expect(component.filteredTasks[0].title).toBe('Test Task 2'); // 2024-06-01
    expect(component.filteredTasks[1].title).toBe('Test Task 1'); // 2024-07-01
    expect(component.filteredTasks[2].title).toBe('Test Task 3'); // 2024-08-01
  });

  it('should sort tasks by priority correctly', () => {
    component.sortByPriority();
    expect(component.filteredTasks[0].priority).toBe('Low');
    expect(component.filteredTasks[1].priority).toBe('Medium');
    expect(component.filteredTasks[2].priority).toBe('High');
  });
});
