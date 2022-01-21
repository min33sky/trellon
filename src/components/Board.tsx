import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
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
    <Wrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard index={index} toDo={toDo} key={toDo} />
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
