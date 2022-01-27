import React from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodoState, orderState, toDoState } from '../atoms/toDo';

const Form = styled.form<{ error?: boolean }>`
  /*  */
  position: absolute;
  top: 100px;
  width: 100%;
  max-width: 240px;

  input {
    width: 100%;
    border: 0;
    border-radius: 10px;
    outline: none;
    padding: 10px 20px;

    ::placeholder {
      color: ${(props) => (props.error ? 'red' : 'black')};
    }
  }
`;

interface IForm {
  boardName: string;
}

/**
 * 새로운 보드 추가 컴포넌트
 * @returns
 */
function AddBoard() {
  const [toDos, setTodos] = useRecoilState(toDoState);
  const setOrder = useSetRecoilState(orderState);

  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IForm>();

  /**
   * 보드 검증 핸들러
   * @param boardName 생성할 보드의 이름
   * @returns
   */
  const onValid = ({ boardName }: IForm) => {
    if (!boardName || !boardName.trim()) {
      setError('boardName', {
        type: 'validate',
        message: '보드명을 입력해주세요!!',
      });
      setValue('boardName', '');
      return;
    }

    if (Object.keys(toDos).includes(boardName)) {
      setError('boardName', {
        type: 'validate',
        message: '같은 보드명이 존재합니다!!',
      });
      setValue('boardName', '');
      return;
    }

    //* 보드를 새로 생성 한 후 순서와 함께 상태값 업데이트
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardName]: [],
      };
    });

    setOrder((prev) => [...prev, boardName]);

    //* 로컬 스토리지에 추가
    const toDosStorage = localStorage.getItem('toDos');
    const orderStorage = localStorage.getItem('order');

    if (toDosStorage && orderStorage) {
      const oldBoards: ITodoState = JSON.parse(toDosStorage);
      const newBoards = {
        ...oldBoards,
        [boardName]: [],
      };
      localStorage.setItem('toDos', JSON.stringify(newBoards));

      const oldOrder: string[] = JSON.parse(orderStorage);
      localStorage.setItem('order', JSON.stringify([...oldOrder, boardName]));
    } else {
      const newBoards = {
        [boardName]: [],
      };
      localStorage.setItem('toDos', JSON.stringify(newBoards));
      localStorage.setItem('order', JSON.stringify([boardName]));
    }

    setValue('boardName', '');
  };

  return (
    <Form onSubmit={handleSubmit(onValid)} error={Boolean(errors.boardName)}>
      <input
        type="text"
        placeholder={
          errors.boardName ? errors.boardName?.message : '추가 할 보드의 제목을 입력하세요.'
        }
        {...register('boardName', {
          maxLength: 10,
        })}
      />
    </Form>
  );
}

export default AddBoard;
