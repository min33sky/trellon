import { nanoid } from 'nanoid';
import { Droppable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { ITodo, orderState, toDoState } from '../atoms/toDo';
import DraggableCard from './DraggableCard';

const Wrapper = styled.ul`
  background-color: ${(props) => props.theme.boardColor};
  padding-top: 10px;
  border-radius: 5px;
  min-width: 260px;
  height: 500px;
  height: 500px;

  /* 드롭 가능 범위를 최대 범위로 고정시키기 위해서 */
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 18px;
  gap: 10px;
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
  overflow-y: auto;

  /* 스크롤바 설정*/
  ::-webkit-scrollbar {
    width: 6px;
  }

  /* 스크롤바 막대 설정*/
  ::-webkit-scrollbar-thumb {
    height: 17%;
    background-color: rgba(39, 60, 117, 0.8);
    border-radius: 10px;
  }

  /* 스크롤바 뒷 배경 설정*/
  ::-webkit-scrollbar-track {
    background-color: rgba(39, 60, 117, 0.33);
  }
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  input {
    width: 80%;
    padding: 8px;
    font-size: 14px;
    outline: none;
    border: none;
    border-radius: 10px;
  }
`;

const TrashIcon = styled.svg`
  display: block;
  width: 25px;
  height: 25px;
  color: black;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    color: rgba(232, 65, 24, 1);
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
 * 드래그한 카드를 드롭할 수 있는 컴포넌트
 * @param toDos 현재 보드의 상태 값
 * @param boardId 보드 아이디
 * @returns
 */
function Board({ toDos, boardId }: IBoard) {
  const setTodos = useSetRecoilState(toDoState);
  const setOrders = useSetRecoilState(orderState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  /**
   * Form 검증 핸들러
   * @param toDo 인풋 내용
   */
  const onValid = ({ toDo }: IForm) => {
    // 상태에 추가할 객체 생성
    const newTodo: ITodo = {
      id: nanoid(),
      text: toDo.trim(),
    };

    // 상태 업데이트
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newTodo],
      };
    });

    // 인풋 초기화
    setValue('toDo', '');
  };

  /**
   * 카드 제거 핸들러
   * @param index 삭제할 카드의 인덱스
   */
  const handleRemoveCard = (index: number) => {
    // 상태에서 해당 카드 제거
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: allBoards[boardId].filter((_, idx) => idx !== index),
      };
    });
  };

  /**
   * 보드 삭제 핸들러
   */
  const handleRemoveBoard = () => {
    setTodos((allBoards) => {
      const copyBoards = { ...allBoards };
      delete copyBoards[boardId];
      return copyBoards;
    });

    setOrders((allOrders) => allOrders.filter((order) => boardId !== order));
  };

  return (
    <Wrapper>
      <Title>
        <span>{boardId}</span>
        <TrashIcon
          onClick={handleRemoveBoard}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </TrashIcon>
      </Title>

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
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
                onRemove={handleRemoveCard}
              />
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
