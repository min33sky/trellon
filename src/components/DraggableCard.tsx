import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

interface IDraggableCard {
  toDo: string;
  index: number;
}

const Card = styled.li`
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
`;

/**
 * 드래그 할 수 있는 카드 컴포넌트
 * @param param0
 * @returns
 */
function DraggableCard({ index, toDo }: IDraggableCard) {
  // console.log(`${toDo} is rendered. ${DraggableCard.name}`);

  return (
    <Draggable draggableId={toDo} index={index}>
      {(magic) => (
        <Card ref={magic.innerRef} {...magic.dragHandleProps} {...magic.draggableProps}>
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
