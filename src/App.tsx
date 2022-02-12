import styled, { ThemeProvider } from 'styled-components';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { darkTheme } from './theme';
import { useRecoilState } from 'recoil';
import { orderState, toDoState } from './atoms/toDo';
import { GlobalStyle } from './styles/global';
import AddBoard from './components/AddBoard';
import DraggableBoard from './components/DraggableBoard';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  /* width: 100vw; */
  max-width: 1280px;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  overflow-x: auto;
  gap: 20px;
  padding-bottom: 2rem;
  cursor: grab;

  /* 스크롤바 설정*/
  ::-webkit-scrollbar {
    /* width: 10px; */
    height: 10px;
  }

  /* 스크롤바 막대 설정*/
  ::-webkit-scrollbar-thumb {
    /* height: 22%; */
    background: linear-gradient(to right, rgba(113, 128, 147, 0.5), rgba(127, 143, 166, 0.5));
    /* 스크롤바 둥글게 설정    */
    border-radius: 10px;
  }

  /* 스크롤바 뒷 배경 설정*/
  ::-webkit-scrollbar-track {
    background-color: rgba(33, 133, 133, 0);
  }
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const [order, setOrder] = useRecoilState(orderState);

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
     * ? type: 드롭할 수 있는 영역의 타입
     */
    const { source, destination, type } = dropResult;

    if (!destination) return; // 제자리 드래그일 땐 무시

    //* 보드 자체를 드래그 앤 드랍 할 경우
    if (type === 'category') {
      setOrder((prev) => {
        const orderCopy = [...prev];
        const selectCategory = orderCopy[source.index];
        orderCopy.splice(source.index, 1);
        orderCopy.splice(destination.index, 0, selectCategory);
        return orderCopy;
      });
    }

    //* 같은 보드에서 드래그 앤 드랍 할 경우
    else if (source.droppableId === destination?.droppableId) {
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

        return {
          ...allBoards,
          [destination.droppableId]: boardCopy,
        };
      });
    }

    //* 다른 보드로 드래그 앤 드랍 할 경우
    else if (source.droppableId !== destination?.droppableId) {
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
      <HelmetProvider>
        <Helmet>
          <title>Trellon</title>
        </Helmet>

        <ThemeProvider theme={darkTheme}>
          <GlobalStyle />

          {/* 드래그 앤 드랍할 수 있는 컴포넌트  */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Wrapper>
              <AddBoard />

              <Droppable droppableId="category" type="category" direction="horizontal">
                {(provided) => (
                  <Boards ref={provided.innerRef} {...provided.droppableProps}>
                    {order.map((key, index) => (
                      <DraggableBoard
                        key={key}
                        draggableId={key}
                        index={index}
                        toDos={toDos[key]}
                      />
                    ))}
                    {provided.placeholder}
                  </Boards>
                )}
              </Droppable>
            </Wrapper>
          </DragDropContext>
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
