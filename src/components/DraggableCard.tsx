import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Card = styled.li<{ isDragging: boolean }>`
  /* 드래그 할 때 카드의 색상 변경 */
  background-color: ${(props) => (props.isDragging ? '#e4f2ff' : props.theme.cardColor)};
  box-shadow: ${(props) => (props.isDragging ? '0px 2px 5px rgba(0,0,0,0.5)' : 'none')};
  border-radius: 5px;
  margin-bottom: 8px;
  padding: 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    font-weight: 600;
  }
`;

const RemoveIcon = styled.svg`
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

interface IDraggableCard {
  toDoId: string;
  toDoText: string;
  index: number;
  onRemove: (index: number) => void;
}

/**
 * 드래그 할 수 있는 카드 컴포넌트
 * @param index 카드 인덱스값
 * @returns
 */
function DraggableCard({ index, toDoId, toDoText, onRemove }: IDraggableCard) {
  return (
    <Draggable draggableId={toDoId} index={index}>
      {(magic, snapshot) => (
        <Card
          isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <p>{toDoText}</p>
          <RemoveIcon
            onClick={() => onRemove(index)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </RemoveIcon>
        </Card>
      )}
    </Draggable>
  );
}

/**
 * 부모 컴포넌트에 의한 리렌더링 최적화를 위해 React.memo 적용
 */
export default React.memo(DraggableCard);
