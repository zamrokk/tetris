import React from 'react';
import TetrisGame from './TetrisGame';
import '../styles/App.css';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <TetrisGame />
    </div>
  );
};

export default App;
