/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import './App.css';
import * as Tone from 'tone';

import Button from './components/Button';
import NavStyles from './components/sidebar.module.css';

function App() {
  const [isOpen, setOpen] = useState(false);
  // const [synthType, updateSynth] = useState('Synth');
  const [synthStyle, updateStyle] = useState('default');
  const [synthType, updateType] = useState('piano');
  const [synthVolume, updateVolume] = useState(false);
  const [synth, updateSynth] = useState(new Tone.Synth());
  const isMobile = (window.screen.width < 780);
  // const synth = new Tone.Synth();
  // Set wave type
  // synth.oscillator.type = 'sine';
  // const pitchShift = new Tone.PitchShift({
  //   pitch: 1,
  // }).toDestination();

  // synth.connect(pitchShift);

  // vibration API supported
  if ('vibrate' in navigator) console.log('Vibration Supported');
  else console.log('Vibration Not Supported');

  document.addEventListener(
    'pointerdown', () => {
      if (Tone.context.state !== 'running') {
        Tone.context.resume();
      }
    },
  );

  function getNote(note, deviceTilt) {
    // const playNotes = ['A#4', 'B#4', 'C#4', 'D#4', 'E#4', 'F#4', 'G#4'];
    // let finalIndex = playNotes.findIndex((d) => d === toString(note))
    // + (Math.floor(deviceTilt / 13));
    // if (finalIndex < 0) {
    //   finalIndex += 7;
    //   return playNotes[finalIndex];
    // }
    // if (finalIndex > 6) {
    //   finalIndex -= 6;
    //   return playNotes[finalIndex];
    // }
    // return playNotes[finalIndex];
    const re = deviceTilt >= 0 ? Math.floor(deviceTilt / 45) : Math.ceil(deviceTilt / 45);
    return `${note}#${5 - re}`;

    // return `${note}#${4 - re}`;
  }

  // Connect to master output
  synth.toDestination();
  useEffect(() => {
    let rotVal;
    function handleMotionEvent(event) {
      rotVal = event.gamma;
      // const x = event.beta;
      if (synthVolume) {
        synth.volume.value = Math.floor(rotVal / 4);
        console.log(synth.volume.value);
      }
      // if (x > 90 || x < -90) {
      //   synth.volume.value = -100;
      // } else {
      //   synth.volume.value = 0;
      // }
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
          console.log('ran');
          navigator.vibrate(10000);
          const playNote = getNote(e.target.innerText, rotVal);
          synth.triggerAttack(playNote, '32n');
          console.log('Initial Trigger: ', e.target.innerText, ' Final Trigger: ', playNote);
        } catch (err) {
          console.log(err);
        }
      });

      // Event Listener for clicking "off" notes

      notes.addEventListener('pointerup', () => {
        navigator.vibrate(0);
        synth.triggerRelease();
      });
      // if (synthStyle === 'Vibrato') {
      //   notes.addEventListener('onfocus', () => {
      //     synth.triggerRelease();
      //   });
      // } else {
      //   notes.addEventListener('pointerup', () => {
      //     synth.triggerRelease();
      //   });
      // }
    }
  }, [synthVolume, synthType, isMobile]);

  const updateSynthStyle = (style) => {
    updateStyle(style);
    if (style === 'default') {
      console.log('updated');
      updateSynth(synth.disconnect());
      console.log(synth);
    }
    if (style === 'distortion') {
      updateSynth(synth.disconnect());
      updateSynth(synth.connect(new Tone.Distortion(4).toDestination()));
    } else if (style === 'reverb') {
      // updateSynth(synth.disconnect());
      updateSynth(synth.connect(new Tone.Reverb(4).toDestination()));
    } else if (style === 'vibrato') {
      // to-do
    }
  };

  const updateSynthType = (type) => {
    updateType(type);
    if (type === 'piano') {
      updateSynth(synth.disconnect());
      updateSynth(new Tone.Synth());
      // synth.oscillator.type = 'sine';
    }
    if (type === 'strings') {
      updateSynth(synth.disconnect());
      updateSynth(new Tone.DuoSynth().toDestination());
    }
    if (type === 'drums') {
      updateSynth(synth.disconnect());
      updateSynth(new Tone.MembraneSynth().toDestination());
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
              <Button><span>A</span></Button>
              <Button><span>B</span></Button>
              <Button><span>C</span></Button>
              <Button><span>D</span></Button>
              <Button><span>E</span></Button>
              <Button><span>F</span></Button>
              <Button><span>G</span></Button>
              <Button><span>B</span></Button>
            </div>
            <button className={NavStyles.button} onClick={() => setOpen(!isOpen)}> </button>

            {isOpen ? (
              <div className={NavStyles.navContent} id="menu">
                <h2>Options</h2>
                <h4 className={NavStyles.sidebarTitle}>Voice</h4>
                <p onClick={() => updateSynthType('piano')} className={synthType === 'piano' ? NavStyles.menuActive : ''}>Piano</p>
                <p onClick={() => updateSynthType('strings')} className={synthType === 'strings' ? NavStyles.menuActive : ''}>Strings</p>
                <p onClick={() => updateSynthType('drums')} className={synthType === 'drums' ? NavStyles.menuActive : ''}>Drums</p>

                <h4 className={NavStyles.sidebarTitle}>Effects</h4>
                <p onClick={() => updateSynthStyle('default')} className={synthStyle === 'default' ? NavStyles.menuActive : ''}>Default</p>
                <p onClick={() => updateSynthStyle('distortion')} className={synthStyle === 'distortion' ? NavStyles.menuActive : ''}>Distortion</p>
                <p onClick={() => updateSynthStyle('reverb')} className={synthStyle === 'reverb' ? NavStyles.menuActive : ''}>Reverb</p>
                <p onClick={() => updateSynthStyle('vibrato')} className={synthStyle === 'vibrato' ? NavStyles.menuActive : ''}>Vibrato</p>

                <h4 className={NavStyles.sidebarTitle}>
                  Motion
                  <br />
                  {' '}
                  Pitch
                </h4>
                <p onClick={() => (synthVolume ? updateVolume(false) : updateVolume(true))}>{ synthVolume ? 'Enabled' : 'Disabled' }</p>
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
