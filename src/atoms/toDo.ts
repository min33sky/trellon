import { atom } from 'recoil';

export interface ITodo {
  id: string;
  text: string;
}

export interface ITodoState {
  [key: string]: ITodo[];
}

/**
 * 모든 보드 게시물들의 상태
 */
export const toDoState = atom<ITodoState>({
  key: 'recoilTodo',
  default: {},
  effects: [
    ({ node, onSet, setSelf }) => {
      const storedData = localStorage.getItem(node.key);

      if (storedData !== null) {
        setSelf(JSON.parse(storedData));
      }

      onSet((newValue) => {
        localStorage.setItem(node.key, JSON.stringify(newValue));
      });
    },
  ],
});

/**
 * 보드의 순서를 나타내는 상태
 */
export const orderState = atom<string[]>({
  key: 'recoilTodoOrder',
  default: [],
  effects: [
    ({ node, onSet, setSelf }) => {
      const storedData = localStorage.getItem(node.key);
      console.debug('로컬 스토리지에 로딩....');
      if (storedData !== null) {
        setSelf(JSON.parse(storedData));
      }

      onSet((newValue) => {
        localStorage.setItem(node.key, JSON.stringify(newValue));
        console.debug('로컬 스토리지에 저장되었습니다.');
      });
    },
  ],
});
