import React, {Component} from 'react';
import WebMidi from 'webmidi';

import Key from '../components/key';

class App extends Component {

  componentDidMount() {
    WebMidi.enable(err => {
      if (err) {
        console.log(`WebMidi could not be enabled.`, err);
      } else {
        console.log(`WebMidi enabled!`);
        this.initMidiControls();
      }
    });
  }

  initMidiControls() {
    const input = WebMidi.getInputByName(`Keystation Mini 32`);
    input.addListener(`noteon`, `all`, e => {
      this.handlePlayNote(e);
    });
    input.addListener(`noteoff`, `all`, e => {
      this.handleReleaseNote(e);
    });
  }

  handlePlayNote(e) {
    console.log(`Received 'noteon' message (${  e.note.name  }${e.note.octave  }).`);
    document.querySelector(`.${  e.note.name  }${e.note.octave  }`).classList.add(`pushed`);
  }

  handleReleaseNote(e) {
    console.log(`Received 'noteoff' message (${  e.note.name  }${e.note.octave  }).`);
    document.querySelector(`.${  e.note.name  }${e.note.octave  }`).classList.remove(`pushed`);
  }

  render() {
    return (
        <main>
          Super C00le App van KEVIN en ook een beetje van Anthony.
          <Key color={`white`} note={`C0`} />
        </main>
    );
  }
}

export default App;
