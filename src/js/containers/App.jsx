import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';
import io from 'socket.io-client';

import Key from '../components/key';
import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

class App extends Component {

  componentDidMount() {
    this.socket = io(`/`);
    this.socket.on(`playnote`, this.handleWSPlayNote);
    this.socket.on(`releasenote`, this.handleWSReleaseNote);
    WebMidi.enable(err => {
      if (err) {
        console.log(`WebMidi could not be enabled.`, err);
      } else {
        console.log(`WebMidi enabled!`);
        this.initMidiControls();
      }
    });
  }

  handleWSPlayNote = note => {
    document.querySelector(`.nr-${note.note.number}`).classList.add(`pushed`);
    const reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
    const synth = new Tone.FMSynth(Synthpresets[0]).chain(reverb);
    synth.triggerAttackRelease(`${note.note.name}${note.note.octave}`, `8n`);
    console.log(`audio triggered by socket`);
  }

  handleWSReleaseNote = note => {
    console.log(`Received 'noteoff' message (${  note.note.name  }${note.note.octave  }).`);
    document.querySelector(`.nr-${note.note.number}`).classList.remove(`pushed`);
  }

  initMidiControls() {
    if (WebMidi.getInputByName(`Keystation Mini 32`)) {
      const input = WebMidi.getInputByName(`Keystation Mini 32`);
      input.addListener(`noteon`, `all`, e => {
        console.log(`Received 'noteon' message (${  e.note.name  }${e.note.octave  }).`);
        this.socket.emit(`noteplayed`, e);
      });
      input.addListener(`noteoff`, `all`, e => {
        this.socket.emit(`notereleased`, e);
      });
    } else {
      console.log(`Keystation Mini 32 was not found! :(`);
    }
  }

  render() {
    return (
        <main>
          {Keylayout.map((k, i) => <Key {...k} key={i} id={i} />)}
        </main>
    );
  }
}

export default App;
