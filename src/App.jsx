/* eslint-disable no-console */
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import * as Tone from 'tone';

import Button from './components/Button';
import NavStyles from './components/sidebar.module.css';


function App() {
  const [isOpen, setOpen] = useState(false);
  // const [synthType, updateSynth] = useState('Synth');
  const [synthStyle, updateStyle] = useState('default');
  const [synthType, updateType] = useState('piano');
  const synthTypeRef = useRef(synthType);

  const [synthVolume, updateVolume] = useState(false);
  const [transposeVal, updateTranspose] = useState(0);
  const [scale, updateScale] = useState(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  const scaleMode = 'major';
  const [synth, updateSynth] = useState(new Tone.Synth());
  const synthRef = useRef(synth)

  const [color, updateColor] = useState('rgb(0,0,0)');
  const isMobile = (window.screen.width < 780);
  const allNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  document.addEventListener(
    'touchstart', () => {
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
    const playNote = `${note}${5 - re}`;
    synthRef.current.triggerAttack(playNote, Tone.context.currentTime);

    // return `${note}#${4 - re}`;
  }

  function setColor(deviceTilt) {
    const re = deviceTilt >= 0 ? Math.floor(deviceTilt / 45) : Math.ceil(deviceTilt / 45);
    switch (re) {
      case -1:
        updateColor('rgb(99,156,217)'); break;
      case 0:
        updateColor('rgb(0,0,0)'); break;
      case 1:
        updateColor('rgb(84,84,197)'); break;
      default:
        updateColor('rgb(0,0,0)'); break;
    }
  }
  // Connect to master output
  synth.toDestination();
  useEffect(() => {
    Tone.Transport.scheduleRepeat((time) => {
      // console.log(time);
    }, '8n');
    let rotVal;
    function handleMotionEvent(event) {
      rotVal = event.gamma;
      // const x = event.beta;
      setColor(rotVal);
      if (synthVolume) {
        synth.volume.value = Math.floor(rotVal / 4);
        console.log(synth.volume.value);
      }
    }
    window.addEventListener('deviceorientation', handleMotionEvent, true);


    const playNote = (e) => {
      // Grabs note name from 'data-note'
      console.log(e.touches.length);
      try {
        // synth.triggerAttack(e.target.innerText, '16n');
        navigator.vibrate(10000);
        if (synthTypeRef.current === 'drums') {
          playDrums(e);
        }
        else {
          getNote(e.target.innerText, rotVal);
        }
      } catch (err) {
        console.log(err);
      }
    }

    const playDrums = (e) => {
      // Tone.Buffer.supportsType('mp3')
      const drum = new Tone.Player(`./${e.target.innerText}.wav`).toDestination();
      // const drumName = ['hat', 'snare', 'kick', 'cowbel']
      // const drum = new Tone.Player(`https://oramics.github.io/sampled/DM/CR-78/samples/${e.target.innerText}.wav`).toDestination();
      Tone.loaded().then(() => {
        drum.start();
      });
    }

    if (isMobile) {
      console.log('Adding Listners');
      // Event Listener for clicking "on" notes
      var notes = document.getElementById("notes");
      console.log(notes);
      notes.addEventListener('touchstart', playNote);

      notes.addEventListener('touchend', () => {
        navigator.vibrate(0);
        synthRef.current.triggerRelease();
      });
    }

    // eslint-disable-next-line
  }, [synthVolume, synthTypeRef, isMobile]);

  const updateSynthStyle = (style) => {
    updateStyle(style);
    if (style === 'default') {
      console.log('updated');
      updateSynth(synth.disconnect());
      console.log(synth);
    }
    if (style === 'distortion') {
      updateSynth(synth.disconnect());
      synthRef.current = synth.connect(new Tone.Distortion(4).toDestination())
      updateSynth(synth.connect(new Tone.Distortion(4).toDestination()));
    } else if (style === 'reverb') {
      updateSynth(synth.disconnect());
      updateSynth(synth.connect(new Tone.Reverb(4).toDestination()));
    } else if (style === 'vibrato') {
      updateSynth(synth.disconnect());
      updateSynth(synth.connect(new Tone.Vibrato(3, 0.5).toDestination()));
    }
  };

  const updateSynthType = (type) => {
    synthTypeRef.current = type;
    updateType(type);

    console.log(synthType)
    if (type === 'piano') {
      synthRef.current = new Tone.Synth().toDestination()
      updateSynth(synth.disconnect());
      updateSynth(new Tone.Synth());
      // synth.oscillator.type = 'sine';
    }
    if (type === 'strings') {
      synthRef.current = new Tone.FMSynth().toDestination()
      updateSynth(synth.disconnect());
      updateSynth(new Tone.DuoSynth().toDestination());
    }
  };

  const updateNotes = (value) => {
    updateTranspose(value);
    const newNotes = [];
    console.log(value);
    if (scaleMode === 'major' && value >= 0 && value <= 11 && value !== '') {
      const intervals = [2, 2, 1, 2, 2, 2, 1];
      let i = parseInt(value);
      let counter = 0;
      while (newNotes.length !== 7) {
        console.log('adding', allNotes[i]);
        newNotes.push(allNotes[i]);
        i += intervals[counter];
        console.log(intervals[counter]);
        counter++;
      }
      updateScale(newNotes);
    }
    // updateNotes([])
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
              <Button color={color}><span>{synthType === 'drums' ? 'conga' : scale[5]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'cowbell' : scale[6]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'kick' : scale[0]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'snare' : scale[1]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'hihat' : scale[2]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'cymbal' : scale[3]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'rim' : scale[4]}</span></Button>
              <Button color={color}><span>{synthType === 'drums' ? 'tamb' : scale[5]}</span></Button>
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
                  Volume
                </h4>
                <p onClick={() => (synthVolume ? updateVolume(false) : updateVolume(true))}>{synthVolume ? 'Enabled' : 'Disabled'}</p>
                <h4 className={NavStyles.sidebarTitle}>Transpose</h4>
                <input type="number" onChange={(e) => updateNotes(e.target.value)} min="0" max="11" />
                {transposeVal < 0 ? <p className={NavStyles.alertText}>transpose value between 0-11</p> : ''}
              </div>
            ) : ''}

          </>
        )}
      {
        !isMobile && (
          <div className="titleText">
            <h1>Sorry, this app is only supported on mobile devices.</h1>
          </div>
        )
      }
    </div>
  );
}

export default App;
