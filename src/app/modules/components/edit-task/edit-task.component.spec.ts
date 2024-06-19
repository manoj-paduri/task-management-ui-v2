import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { EditTaskComponent } from './edit-task.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { taskReducer } from '../../state/task.reducer';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

describe('EditTaskComponent', () => {
  let component: EditTaskComponent;
  let fixture: ComponentFixture<EditTaskComponent>;
  let store: MockStore;

  const initialState = {
    tasks: [
      { id: '1', title: 'Test Task 1', description: 'Description 1', dueDate: new Date(), priority: 'Low', completed: false }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTaskComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatCardModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load task details and set form values', () => {
    component.ngOnInit();
    expect(component.taskForm.controls['title'].value).toBe('Test Task 1');
    expect(component.taskForm.controls['description'].value).toBe('Description 1');
  });

  it('should have a valid form when all fields are filled', () => {
    component.taskForm.controls['title'].setValue('Test Task');
    component.taskForm.controls['description'].setValue('Description');
    component.taskForm.controls['dueDate'].setValue(new Date());
    component.taskForm.controls['priority'].setValue('Low');
    expect(component.taskForm.valid).toBeTruthy();
  });

  it('should dispatch updateTask action when form is valid and submitted', () => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    component.taskForm.controls['title'].setValue('Test Task');
    component.taskForm.controls['description'].setValue('Description');
    component.taskForm.controls['dueDate'].setValue(new Date());
    component.taskForm.controls['priority'].setValue('Low');

    component.onSubmit();

    expect(storeSpy).toHaveBeenCalled();
  });
});
