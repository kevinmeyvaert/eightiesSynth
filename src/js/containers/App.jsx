import React, {Component} from 'react';
import WebMidi from 'webmidi';

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
  }

  handlePlayNote(e) {
    console.log(`Received 'noteon' message (${  e.note.name  }${e.note.octave  }).`);
  }

  render() {
    return (
        <main>
          Super C00le App van KEVIN en ook een beetje van Anthony.
        </main>
    );
  }
}

export default App;
