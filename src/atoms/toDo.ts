import { atom } from 'recoil';

interface ITodoState {
  [key: string]: string[];
}

export const toDoState = atom<ITodoState>({
  key: 'toDo',
  default: {
    'To Do': ['a', 'd', 'f'],
    Doing: ['c', 'e'],
    Done: ['b'],
  },
});
