import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';
import io from 'socket.io-client';

import Key from '../components/key';
import Statusbar from '../components/Statusbar';

import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

class App extends Component {

  state = {
    users: [],
    notes: Keylayout,
    synth: {}
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

      // initiate FM synth + fx
      const reverb: Object = new Tone.JCReverb(0.7).connect(Tone.Master);
      const synth: Object = new Tone.FMSynth(Synthpresets[0]).chain(reverb);
      this.setState({synth});

      input.addListener(`noteon`, `all`, e => {
        this.socket.emit(`noteplayed`, e);
      });
      input.addListener(`noteoff`, `all`, e => {
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
    let {notes} = this.state;
    const {users, synth} = this.state;

    // who played the note
    const userPlayed: Object = users.filter(u => u.socketId === socketId);

    notes = notes.map(n => {
      if (n.number === note.note.number) n.played = true, n.playedby = userPlayed[0].color;
      return n;
    });
    this.setState({notes});

    // trigger played note
    synth.triggerAttackRelease(`${note.note.name}${note.note.octave}`, `8n`);

  }

  handleWSReleaseNote = (note: Object) => {
    let {notes} = this.state;

    notes = notes.map(n => {
      if (n.number === note.note.number) n.played = false, n.playedby = ``;
      return n;
    });
    this.setState({notes});
  }

  render() {
    const {users, notes} = this.state;

    return (
      <main>
        <div className='piano-wrapper'>
          <div className='piano'>
            {notes.map((k, i) => <Key {...k} key={i} id={i} />)}
          </div>
        </div>
        <Statusbar users={users} />
      </main>
    );
  }
}

export default App;
