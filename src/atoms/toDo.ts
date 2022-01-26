import { atom } from 'recoil';

export interface ITodo {
  id: string;
  text: string;
}

export interface ITodoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<ITodoState>({
  key: 'toDo',
  default: {},
});
