import { atom } from 'recoil';

export interface ITodo {
  id: string;
  text: string;
}

interface ITodoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<ITodoState>({
  key: 'toDo',
  default: {
    'To Do': [
      { id: '1', text: 'a' },
      { id: '2', text: 'b' },
    ],
    Doing: [
      { id: '3', text: 'c' },
      { id: '5', text: 'e' },
    ],
    Done: [{ id: '4', text: 'd' }],
  },
});
