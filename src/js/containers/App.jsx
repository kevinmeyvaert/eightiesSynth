import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';
import io from 'socket.io-client';

import Key from '../components/key';
import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

class App extends Component {

  state = {
    users: []
  }

  componentDidMount() {
    this.socket = io(`/`);
    this.socket.on(`init`, this.handleWSInit);
    this.socket.on(`leave`, this.handleWSLeave);
    this.socket.on(`join`, this.handleWSJoin);
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

  handleWSInit = (users: Object) => {
    const {id: socketId} = this.socket;

    users = users.map(u => {
      if (u.socketId === socketId) u.isMe = true;
      return u;
    });

    this.setState({users});
  }

  handleWSJoin = (user: Object) => {
    const {users} = this.state;
    users.push(user);
    this.setState({users});
  }

  handleWSLeave = (socketId: String) => {
    let {users} = this.state;
    users = users.filter(u => u.socketId !== socketId);
    this.setState({users});
  }

  handleWSPlayNote = ({note, socketId}) => {
    const {users} = this.state;
    console.log({users});
    const userPlayed = users.filter(u => u.socketId === socketId);
    console.log(userPlayed);
    // show feedback
    document.querySelector(`.nr-${note.note.number}`).style.backgroundColor = `${userPlayed[0].color}`;

    // initiate FM synth + fx
    const reverb: Object = new Tone.JCReverb(0.4).connect(Tone.Master);
    const synth: Object = new Tone.FMSynth(Synthpresets[0]).chain(reverb);

    // trigger played note
    synth.triggerAttackRelease(`${note.note.name}${note.note.octave}`, `8n`);
    console.log(`audio triggered by socket`);
  }

  handleWSReleaseNote = (note: Object) => {
    // hide feedback
    document.querySelector(`.nr-${note.note.number}`).style.backgroundColor = null;
  }

  render() {
    return (
      <div className='piano-wrapper'>
        <div className='piano'>
          {Keylayout.map((k, i) => <Key {...k} key={i} id={i} />)}
        </div>
      </div>
    );
  }
}

export default App;
