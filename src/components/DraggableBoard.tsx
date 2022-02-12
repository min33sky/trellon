import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { ITodo } from '../atoms/toDo';
import Board from './Board';

interface IDraggableBoardProps {
  draggableId: string;
  index: number;
  toDos: ITodo[];
}

/**
 * 드래그 할 수 있는 보드
 * @param draggableId 보드의 id
 * @param index 보드의 위치를 나타내는 index
 * @param toDos 투두 내용이 담긴 배열
 * @returns
 */
function DraggableBoard({ draggableId, index, toDos }: IDraggableBoardProps) {
  return (
    <Draggable draggableId={`category-${draggableId}`} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <Board toDos={toDos} boardId={draggableId} />
        </div>
      )}
    </Draggable>
  );
}

/**
 * 최적화: 변화없는 컴포넌트가 화면에 다시 그려지는 걸 막는다
 */
export default React.memo(DraggableBoard);
