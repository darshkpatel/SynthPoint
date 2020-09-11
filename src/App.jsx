import React, { useEffect, useState } from 'react';
import './App.css';
import * as Tone from 'tone';

import Button from './components/Button';
import NavStyles from './components/sidebar.module.css';

function App() {
  const [isOpen, setOpen] = useState(false);
  const [synthType, updateSynth] = useState('Synth')
  const isMobile = (window.screen.width < 780);
  // const synth = new Tone.Synth();

  var synth = new Tone.Synth();
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

    function handleMotionEvent(event) {

      var x = event.accelerationIncludingGravity.x;
      var y = event.accelerationIncludingGravity.y;
      var z = event.accelerationIncludingGravity.z;

      console.log(x,y,z)
    }

    // const updateStyle = () => {
    //   var dist = new Tone.Distortion(4).toMaster();
    //   synth = new Tone.Synth().connect(dist);
    // }

    window.addEventListener("devicemotion", handleMotionEvent, true);
  }, [synth]);
  return (
    <div className="App">
      <header className="App-header">
        <title>SynthPoint</title>
      </header>
      {isMobile
        && (
          <>
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
            <button className={NavStyles.button} onClick={() => setOpen(!isOpen)}> </button>

            {isOpen ? <div className={NavStyles.navContent}>
              <h2>Options</h2>
              <h4><u>Voice</u></h4>
              <p onClick={() => updateSynth('Piano')}>Piano</p>
              <p onClick={() => updateSynth('Strings')}>Strings</p>
              <p onClick={() => updateSynth('Drums')}>Drums</p>

              <h4><u>Styles</u></h4>
              <p onClick={() => { synth = new Tone.Synth().connect(new Tone.Distortion(4).toMaster()); }}>Distortion</p>
              <p>Reverb</p>
              <p>Vebrato</p>
            </div> : ''}

          </>
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
