import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { List } from 'react-bootstrap-icons';
import Sidebar from './components/Sidebar';
import CharacterNameGenerator from './components/CharacterNameGenerator';
import WordDictionary from './components/WordDictionary';
import PlotGenerator from './components/PlotGenerator';
import './App.css';
import './components/Sidebar.css';

const initialNameGenState = {
  formData: { year: '', background: '', personality: '', gender: '', age: '', situation: '' },
  names: [], loading: false, error: '', copiedIndex: null,
};

const initialDictState = {
  searchTerm: '', searchHistory: [], loading: false, error: '', result: null,
};

const initialPlotState = {
  // Placeholder for future state
};

function App() {
  // --- STATE MANAGEMENT ---
  const [activeComponent, setActiveComponent] = useState(
    () => localStorage.getItem('activeComponent') || 'CharacterNameGenerator'
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [nameGenState, setNameGenState] = useState(initialNameGenState);
  const [dictState, setDictState] = useState(initialDictState);
  const [plotState, setPlotState] = useState(initialPlotState);

  // --- EFFECTS ---
  useEffect(() => {
    localStorage.setItem('activeComponent', activeComponent);
  }, [activeComponent]);

  // --- HANDLERS ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderComponent = () => {
    switch (activeComponent) {
      case 'CharacterNameGenerator':
        return (
          <CharacterNameGenerator
            state={nameGenState}
            setState={setNameGenState}
            onReset={() => setNameGenState(initialNameGenState)}
          />
        );
      case 'WordDictionary':
        return (
          <WordDictionary
            state={dictState}
            setState={setDictState}
            onReset={() => setDictState(initialDictState)}
          />
        );
      case 'PlotGenerator':
        return (
          <PlotGenerator
            state={plotState}
            setState={setPlotState}
            onReset={() => setPlotState(initialPlotState)}
          />
        );
      default:
        return <CharacterNameGenerator />;
    }
  };

  return (
    <>
      <Button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <List size={30} color={isSidebarOpen ? 'white' : 'black'} />
      </Button>
      <div style={{ display: 'flex' }}>
        {isSidebarOpen && <Sidebar setActiveComponent={setActiveComponent} />}
        <main style={{ 
          position: 'relative',
          flexGrow: 1, 
          padding: '40px', 
          overflowY: 'auto', 
          height: '100vh',
          marginLeft: isSidebarOpen ? '250px' : '0',
          transition: 'margin-left 0.3s ease'
        }}>
          {renderComponent()}
        </main>
      </div>
    </>
  );
}

export default App;
