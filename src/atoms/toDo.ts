import { atom } from 'recoil';

interface ITodoState {
  [key: string]: string[];
}

export const toDoState = atom<ITodoState>({
  key: 'toDo',
  default: {
    todo: ['a', 'd', 'f'],
    doing: ['c', 'e'],
    done: ['b'],
  },
});
