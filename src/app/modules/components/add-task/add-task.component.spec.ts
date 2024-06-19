import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddTaskComponent } from './add-task.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { taskReducer } from '../../state/task.reducer';

describe('AddTaskComponent', () => {
  let component: AddTaskComponent;
  let fixture: ComponentFixture<AddTaskComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      providers: [provideMockStore({})]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when fields are empty', () => {
    expect(component.taskForm.valid).toBeFalsy();
  });

  it('should have a valid form when all fields are filled', () => {
    component.taskForm.controls['title'].setValue('Test Task');
    component.taskForm.controls['description'].setValue('Description');
    component.taskForm.controls['dueDate'].setValue(new Date());
    component.taskForm.controls['priority'].setValue('Low');
    expect(component.taskForm.valid).toBeTruthy();
  });

  it('should dispatch addTask action when form is valid and submitted', () => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    component.taskForm.controls['title'].setValue('Test Task');
    component.taskForm.controls['description'].setValue('Description');
    component.taskForm.controls['dueDate'].setValue(new Date());
    component.taskForm.controls['priority'].setValue('Low');

    component.onSubmit();

    expect(storeSpy).toHaveBeenCalled();
  });
});
