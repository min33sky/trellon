import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodo, toDoState } from '../atoms/toDo';
import DraggableCard from './DraggableCard';

const Wrapper = styled.ul`
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 10px;
  border-radius: 5px;
  min-height: 300px;

  /* 드롭 가능 범위를 최대 범위로 고정시키기 위해서 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.div`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean; //? 드래그 한 아이템이 드롭 가능 장소에 있는 지 여부
  draggingFromThisWith: boolean; //? 드래그 한 아이템의 시작 위치인지 여부
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver ? '#dfe6e9' : props.draggingFromThisWith ? '#b2bec3' : 'transparent'};
  flex-grow: 1; // 드롭 장소를 전체 범위로 늘린다
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IBoard {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

/**
 * 카드를 드롭할 수 있는 컴포넌트
 * @param param0
 * @returns
 */
function Board({ toDos, boardId }: IBoard) {
  const setTodos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    console.log(toDo);
    /**
     * TODO
     * 상태 객체에서 현재 상태 객체의 키값만 수정한다.
     */

    // 등록 할 상태값 객체 생성
    const newTodo: ITodo = {
      id: nanoid(),
      text: toDo.trim(),
    };

    console.log('boardId: ', boardId);

    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newTodo],
      };
    });

    // 인풋 초기화
    setValue('toDo', '');
  };

  return (
    <Wrapper>
      <Title>{boardId}</Title>

      <Form onSubmit={handleSubmit(onValid)}>
        <input
          type="text"
          {...register('toDo', {
            required: true,
          })}
          placeholder={`Add task on ${boardId}`}
        />
      </Form>

      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard index={index} toDoId={toDo.id} toDoText={toDo.text} key={toDo.id} />
            ))}

            {/* 드래그 하는 동안에 드롭 공간 크기 변동을 막아준다. */}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
}

export default Board;
