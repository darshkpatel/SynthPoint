import React from 'react';
import './App.css';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <title>SynthPoint</title>
      </header>
      <div className="container">
        <Button><span>A</span></Button>
        <Button><span>B</span></Button>
        <Button><span>C</span></Button>
        <Button><span>D</span></Button>
        <Button><span>E</span></Button>
        <Button><span>F</span></Button>
        <Button><span>G</span></Button>
        <Button><span>B</span></Button>
      </div>
    </div>
  );
}

export default App;
