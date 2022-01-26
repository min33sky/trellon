import styled, { ThemeProvider } from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { darkTheme } from './theme';
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms/toDo';
import Board from './components/Board';
import { GlobalStyle } from './styles/global';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100vw;
  max-width: 680px;
  height: 100vh;
`;

const Boards = styled.div`
  /* display: flex;
  justify-content: center;
  align-items: flex;
  width: 100%;
  gap: 10px; */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (dropResult: DropResult) => {
    console.log(dropResult);

    /**
     * ? draggableId: 드래그 한 카드의 ID
     * ? source: 드래그 시점의 카드 정보
     * ? destination: 드래그 완료시 카드 정보
     */
    const { draggableId, source, destination } = dropResult;

    if (!destination) return;

    //* 같은 보드에서 드래그 앤 드랍 할 경우
    if (source.droppableId === destination?.droppableId) {
      setToDos((allBoards) => {
        // 현재 보드의 상태값의 배열을 복사한다.
        const boardCopy = [...allBoards[source.droppableId]];
        // 이동 시킬 요소 값
        const taskObj = boardCopy[source.index];
        // 이동 시작점의 요소를 삭제
        boardCopy.splice(source.index, 1);
        // 이동 시킬 요소 값을 추가
        boardCopy.splice(destination.index, 0, taskObj);

        return {
          ...allBoards,
          [destination.droppableId]: boardCopy,
        };
      });
    }

    //* 다른 보드로 드래그 앤 드랍 할 경우
    if (source.droppableId !== destination?.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];

        const taskObj = sourceBoard[source.index];

        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);

        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />

        {/* 드래그 앤 드랍할 수 있는 컴포넌트  */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Wrapper>
            <Boards>
              {Object.keys(toDos).map((key) => (
                <Board key={key} toDos={toDos[key]} boardId={key} />
              ))}
            </Boards>
          </Wrapper>
        </DragDropContext>
      </ThemeProvider>
    </>
  );
}

export default App;
