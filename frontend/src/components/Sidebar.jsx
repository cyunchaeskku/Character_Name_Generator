import { Nav } from 'react-bootstrap';
import { Pen, Book, Lightbulb } from 'react-bootstrap-icons';
import './Sidebar.css';

function Sidebar({ setActiveComponent }) {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link onClick={() => setActiveComponent('CharacterNameGenerator')}>
          <Pen className="me-2" />
          이름 생성기
        </Nav.Link>
        <Nav.Link onClick={() => setActiveComponent('WordDictionary')}>
          <Book className="me-2" />
          단어 사전
        </Nav.Link>
        <Nav.Link onClick={() => setActiveComponent('PlotGenerator')}>
          <Lightbulb className="me-2" />
          플롯 생성기
        </Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;
