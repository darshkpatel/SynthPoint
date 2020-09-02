import React, { useEffect } from 'react';
import './App.css';
import * as Tone from 'tone';
import Button from './components/Button';

function App() {
  const isMobile = (window.screen.width < 780);
  const synth = new Tone.Synth();

  // Set wave type
  synth.oscillator.type = 'sine';

  document.addEventListener(
    'mousedown', () => {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
    },
  );

  // Connect to master output
  synth.toDestination();
  useEffect(() => {
    if (isMobile) {
      console.log('Adding Listners');
      const notes = document.getElementById('notes');
      // Event Listener for clicking "on" notes
      notes.addEventListener('mousedown', (e) => {
      // Grabs note name from 'data-note'
        try {
          console.log('Triggering', e.target.innerText);
          synth.triggerAttack(e.target.innerText, '16n');
        } catch (e) {
          console.log(e);
        }
      });

      // Event Listener for clicking "off" notes
      notes.addEventListener('mouseup', () => {
        synth.triggerRelease();
      });
    }
  }, [synth]);
  return (
    <div className="App">
      <header className="App-header">
        <title>SynthPoint</title>
      </header>
      {isMobile
      && (
      <div className="container" id="notes">
        <Button><span>A#4</span></Button>
        <Button><span>B#4</span></Button>
        <Button><span>C#4</span></Button>
        <Button><span>D#4</span></Button>
        <Button><span>E#4</span></Button>
        <Button><span>F#4</span></Button>
        <Button><span>G#4</span></Button>
        <Button><span>B#2</span></Button>
      </div>
      )}
      {!isMobile && (
      <div className="titleText">
        <h1>Sorry, this app is only supported on mobile devices.</h1>
      </div>
      )}
    </div>
  );
}

export default App;
