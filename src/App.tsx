import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { darkTheme } from './theme';
import { useRecoilState } from 'recoil';
import { toDoState } from './atoms/toDo';
import Board from './components/Board';

const GlobalStyle = createGlobalStyle`
  /* http://meyerweb.com/eric/tools/css/reset/
    v2.0 | 20110126
    License: none (public domain)
  */

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }
  body {
    line-height: 1;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  body {
    background-color: ${(props) => props.theme.bgColor};
    color: black;
    font-weight: 300;
    line-height: 1.2;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 680px;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    console.log('draggableId: ', draggableId);

    if (!destination) return;

    // setToDos((oldToDos) => {
    //   const toDosCopy = [...oldToDos];
    //   toDosCopy.splice(source.index, 1);
    //   toDosCopy.splice(destination.index, 0, draggableId);
    //   return toDosCopy;
    // });
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
