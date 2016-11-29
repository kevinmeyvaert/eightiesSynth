import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';
import io from 'socket.io-client';

import Key from '../components/key';
import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

class App extends Component {

  state = {
    user: []
  }

  componentDidMount() {
    this.socket = io(`/`);
    this.socket.on(`init`, this.handleWSInit);
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

  initMidiControls() {
    if (WebMidi.getInputByName(`Keystation Mini 32`)) {
      const input = WebMidi.getInputByName(`Keystation Mini 32`);
      input.addListener(`noteon`, `all`, e => {
        console.log(`Received 'noteon' message (${  e.note.name  }${e.note.octave  }).`);
        this.socket.emit(`noteplayed`, e);
      });
      input.addListener(`noteoff`, `all`, e => {
        console.log(`Received 'noteoff' message (${  e.note.name  }${e.note.octave  }).`);
        this.socket.emit(`notereleased`, e);
      });
    } else {
      console.log(`Keystation Mini 32 was not found! :(`);
    }
  }

  handleWSInit = user => {
    this.setState({user});
  }

  handleWSPlayNote = note => {
    const {user} = this.state;
    // show feedback
    document.querySelector(`.nr-${note.note.number}`).style.backgroundColor = `${user.color}`;

    // initiate FM synth + fx
    const reverb = new Tone.JCReverb(0.4).connect(Tone.Master);
    const synth = new Tone.FMSynth(Synthpresets[0]).chain(reverb);

    // trigger played note
    synth.triggerAttackRelease(`${note.note.name}${note.note.octave}`, `8n`);
    console.log(`audio triggered by socket`);
  }

  handleWSReleaseNote = note => {
    // hide feedback
    document.querySelector(`.nr-${note.note.number}`).style.backgroundColor = null;
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
