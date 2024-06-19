import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task.model';
import { addTask, editTask, deleteTask, toggleTaskCompletion } from './task.actions';
import { produce } from 'immer';

export interface TaskState {
  tasks: Task[];
}

export const initialState: TaskState = {
  tasks: [],
};

export const taskReducer = createReducer(
  initialState,
  on(addTask, (state, { task }) => produce(state, draft => { draft.tasks.push(task); })),
  on(editTask, (state, { task }) => produce(state, draft => {
    const index = draft.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      draft.tasks[index] = task;
    }
  })),
  on(deleteTask, (state, { id }) => produce(state, draft => {
    const index = draft.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      draft.tasks.splice(index, 1);
    }
  })),
  on(toggleTaskCompletion, (state, { id }) => produce(state, draft => {
    const index = draft.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      draft.tasks[index].completed = !draft.tasks[index].completed;
    }
  }))
);
