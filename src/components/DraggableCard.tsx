import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

interface IDraggableCard {
  toDo: string;
  index: number;
}

const Card = styled.li<{ isDragging: boolean }>`
  /* 드래그 할 때 카드의 색상 변경 */
  background-color: ${(props) => (props.isDragging ? '#e4f2ff' : props.theme.cardColor)};
  box-shadow: ${(props) => (props.isDragging ? '0px 2px 5px rgba(0,0,0,0.5)' : 'none')};
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
`;

/**
 * 드래그 할 수 있는 카드 컴포넌트
 * @param index 카드 인덱스값
 * @param toDo 카드 내용
 * @returns
 */
function DraggableCard({ index, toDo }: IDraggableCard) {
  // console.log(`${toDo} is rendered. ${DraggableCard.name}`);

  return (
    <Draggable draggableId={toDo} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

/**
 * 부모 컴포넌트에 의한 리렌더링 최적화를 위해 React.memo 적용
 */
export default React.memo(DraggableCard);
