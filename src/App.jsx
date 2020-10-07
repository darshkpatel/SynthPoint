import React, { useEffect, useState } from 'react';
import './App.css';
import * as Tone from 'tone';

import Button from './components/Button';
import NavStyles from './components/sidebar.module.css';

function App() {
  const [isOpen, setOpen] = useState(false);
  // const [synthType, updateSynth] = useState('Synth');
  const [synthStyle, updateStyle] = useState('Synth');
  const isMobile = (window.screen.width < 780);
  // const synth = new Tone.Synth();

  let synth = new Tone.Synth();
  // Set wave type
  synth.oscillator.type = 'sine';

  document.addEventListener(
    'pointerdown', () => {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
    },
  );

  function getNote(note, deviceTilt) {
    const playNotes = ['A#4', 'B#4', 'C#4', 'D#4', 'E#4', 'F#4', 'G#4'];
    let finalIndex = playNotes.findIndex((d) => d === toString(note)) + (Math.floor(deviceTilt / 13));
    if (finalIndex < 0) {
      finalIndex += 7;
      return playNotes[finalIndex];
    }
    if (finalIndex > 6) {
      finalIndex -= 6;
      return playNotes[finalIndex];
    }
    return playNotes[finalIndex];
  }

  // Connect to master output
  synth.toDestination();
  useEffect(() => {
    let rotVal;
    function handleMotionEvent(event) {
      rotVal = event.gamma;
      // var y = event.accelerationIncludingGravity.y;
      // var z = event.accelerationIncludingGravity.z;
    }
    window.addEventListener('deviceorientation', handleMotionEvent, true);

    if (isMobile) {
      console.log('Adding Listners');
      const notes = document.getElementById('notes');
      // Event Listener for clicking "on" notes
      notes.addEventListener('pointerdown', (e) => {
        // Grabs note name from 'data-note'
        try {
          // synth.triggerAttack(e.target.innerText, '16n');
          const playNote = getNote(e.target.innerText, rotVal);
          synth.triggerAttack(playNote, '8n');
          console.log('Initial Trigger: ', e.target.innerText, ' Final Trigger: ', playNote);
        } catch (e) {
          console.log(e);
        }
      });

      // Event Listener for clicking "off" notes

      if (synthStyle === 'Vibrato') {
        notes.addEventListener('pointerup', () => {
          synth.triggerRelease();
        });
      } else {
        notes.addEventListener('pointerup', () => {
          synth.triggerRelease();
        });
      }
    }
  }, [synth, synthStyle, isMobile]);

  const updateSynthStyle = (style) => {
    if (style === 'default') {
      synth = new Tone.Synth();
    }
    if (style === 'distortion') {
      synth = new Tone.Synth().connect(new Tone.Distortion(4).toDestination());
    } else if (style === 'reverb') {
      synth = new Tone.Synth().connect(new Tone.Reverb(4).toDestination());
    } else if (style === 'vibrato') {
      updateStyle('Vibrato');
    }
  };

  const updateSynthType = (type) => {
    if (type === 'strings') {
      synth = new Tone.DuoSynth().toDestination();
    }
    if (type === 'drums') {
      synth = new Tone.MembraneSynth().toDestination();
    }
  };

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

            {isOpen ? (
              <div className={NavStyles.navContent} id="menu">
                <h2>Options</h2>
                <h4><u>Voice</u></h4>
                <p onClick={() => updateSynthType('Piano')}>Piano</p>
                <p onClick={() => updateSynthType('strings')}>Strings</p>
                <p onClick={() => updateSynthType('drums')}>Drums</p>

                <h4><u>Effects</u></h4>
                <p onClick={() => updateSynthStyle('default')}>Default</p>
                <p onClick={() => updateSynthStyle('distortion')}>Distortion</p>
                <p onClick={() => updateSynthStyle('reverb')}>Reverb</p>
                <p onClick={() => updateSynthStyle('vibrato')}>Vibrato</p>
              </div>
            ) : ''}

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
