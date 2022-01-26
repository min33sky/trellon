import styled, { ThemeProvider } from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { darkTheme } from './theme';
import { useRecoilState } from 'recoil';
import { ITodoState, toDoState } from './atoms/toDo';
import Board from './components/Board';
import { GlobalStyle } from './styles/global';
import { useEffect } from 'react';

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
  /**
   * TODO:
   * 1. 로컬 스토리지에 저장 [ ]
   * 2. 삭제 기능 [ ]
   * 3. 보드 자체를 드래그하기 [ ]
   */

  const [toDos, setToDos] = useRecoilState(toDoState);

  useEffect(() => {
    // 로컬 스토리지에 데이터가 존재한다면 불러오기
    if (localStorage.getItem('toDos')) {
      console.log('로컬스토리지의 데이터로 초기화 하겠습니다.');
      setToDos(JSON.parse(localStorage.getItem('toDos')!));
    } else {
      console.log('로컬스토리지가 비어있습니다.');
    }
  }, [setToDos]);

  /**
   * 카드의 드래그 종료 후 이벤트 핸들러
   * @param dropResult
   * @returns
   */
  const onDragEnd = (dropResult: DropResult) => {
    console.log(dropResult);

    /**
     * ? draggableId: 드래그 한 카드의 ID
     * ? source: 드래그 시점의 카드 정보
     * ? destination: 드래그 완료시 카드 정보
     */
    const { draggableId, source, destination } = dropResult;

    if (!destination) return; // 제자리 드래그일 땐 무시

    //* 같은 보드에서 드래그 앤 드랍 할 경우
    if (source.droppableId === destination?.droppableId) {
      // 상태 값 변경
      setToDos((allBoards) => {
        // 현재 보드의 상태값의 배열을 복사한다.
        const boardCopy = [...allBoards[source.droppableId]];
        // 이동 시킬 요소 값
        const taskObj = boardCopy[source.index];
        // 이동 시작점의 요소를 삭제
        boardCopy.splice(source.index, 1);
        // 이동 시킬 요소 값을 추가
        boardCopy.splice(destination.index, 0, taskObj);

        // 로컬 스토리지 업데이트
        if (localStorage.getItem('toDos')) {
          const oldTodos: ITodoState = JSON.parse(localStorage.getItem('toDos')!);
          const boardCopy = [...oldTodos[source.droppableId]];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination.index, 0, taskObj);

          const updateTodos = {
            ...oldTodos,
            [destination.droppableId]: boardCopy,
          };
          localStorage.setItem('toDos', JSON.stringify(updateTodos));
        }

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

        // 로컬 스토리지 업데이트
        if (localStorage.getItem('toDos')) {
          const oldTodos: ITodoState = JSON.parse(localStorage.getItem('toDos')!);
          const sourceBoard = [...oldTodos[source.droppableId]];
          const destinationBoard = [...oldTodos[destination.droppableId]];
          const taskObj = sourceBoard[source.index];
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination.index, 0, taskObj);

          const updateTodos = {
            ...oldTodos,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
          localStorage.setItem('toDos', JSON.stringify(updateTodos));
        }

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
