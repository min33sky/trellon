import { atom } from 'recoil';

export interface ITodo {
  id: string;
  text: string;
}

export interface ITodoState {
  [key: string]: ITodo[];
}

/**
 * 모든 보드들의 상태
 */
export const toDoState = atom<ITodoState>({
  key: 'toDo',
  default: {},
});

/**
 * 보드 순서 상태
 */
export const orderState = atom<string[]>({
  key: 'order',
  default: [],
});
