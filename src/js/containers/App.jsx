import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';

import Key from '../components/key';
import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

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
    if (WebMidi.getInputByName(`Keystation Mini 32`)) {
      const input = WebMidi.getInputByName(`Keystation Mini 32`);
      input.addListener(`noteon`, `all`, e => {
        this.handlePlayNote(e);
      });
      input.addListener(`noteoff`, `all`, e => {
        this.handleReleaseNote(e);
      });
    } else {
      console.log(`Keystation Mini 32 was not found! :(`);
    }
  }

  handlePlayNote(e) {
    console.log(`Received 'noteon' message (${  e.note.name  }${e.note.octave  }).`);
    document.querySelector(`.nr-${e.note.number}`).classList.add(`pushed`);
    const reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
    const synth = new Tone.FMSynth(Synthpresets[0]).chain(reverb);
    synth.triggerAttackRelease(`${e.note.name}${e.note.octave}`, `8n`);
  }

  handleReleaseNote(e) {
    console.log(`Received 'noteoff' message (${  e.note.name  }${e.note.octave  }).`);
    document.querySelector(`.nr-${e.note.number}`).classList.remove(`pushed`);
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
