import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import DraggableCard from './DraggableCard';

const Wrapper = styled.ul`
  background-color: ${(props) => props.theme.boardColor};
  padding: 20px 10px;
  padding-top: 30px;
  border-radius: 5px;
  min-height: 200px;
`;

interface IBoard {
  toDos: string[];
  boardId: string;
}

/**
 * 카드를 드롭할 수 있는 컴포넌트
 * @param param0
 * @returns
 */
function Board({ toDos, boardId }: IBoard) {
  return (
    <Droppable droppableId={boardId}>
      {(magic) => (
        <Wrapper ref={magic.innerRef} {...magic.droppableProps}>
          {toDos.map((toDo, index) => (
            <DraggableCard index={index} toDo={toDo} key={toDo} />
          ))}
          {/* 드래그 하는 동안에 드롭 공간 크기 변동을 막아준다. */}
          {magic.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
}

export default Board;
