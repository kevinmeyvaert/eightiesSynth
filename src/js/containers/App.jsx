import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';
import io from 'socket.io-client';

import Controls from '../components/controls';
import Key from '../components/key';
import Statusbar from '../components/Statusbar';

import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

class App extends Component {

  state = {
    users: [],
    notes: Keylayout,
    synth: {},
    inputReverb: `0`
  }

  isMobile = {
    iOS: () => {
      return navigator.userAgent.match(/Android|iPhone|iPad|iPod/i);
    },
  }

  componentDidMount() {
    this.socket = io(`/`);
    this.socket.on(`init`, this.handleWSInit);
    this.socket.on(`leave`, this.handleWSLeave);
    this.socket.on(`join`, this.handleWSJoin);

    this.checkDevice();

    this.socket.on(`changeReverb`, this.handleWSChangeReverb);

    console.log(this.state);
  }

  checkDevice() {
    if (this.isMobile.iOS()) {
      this.initMobile();
    }
    if (!this.isMobile.iOS()) {
      this.initDesktop();
    }
  }

  initDesktop() {
    WebMidi.enable(err => {
      if (err) {
        console.log(`WebMidi could not be enabled.`, err);
      } else {
        console.log(`WebMidi enabled!`);
        this.initMidiControls();
      }
    });
    this.socket.on(`playnote`, this.handleWSPlayNote);
    this.socket.on(`releasenote`, this.handleWSReleaseNote);
  }

  initMobile() {
    // document.addEventListener(`touchmove`, e => {
    //   e.preventDefault();
    // });
  }

  initMidiControls() {
    if (WebMidi.getInputByName(`Keystation Mini 32`)) {
      const input = WebMidi.getInputByName(`Keystation Mini 32`);
      const {inputReverb} = this.state;

      // initiate FM synth + fx
      const reverb: Object = new Tone.JCReverb(inputReverb).connect(Tone.Master);
      const synth: Object = new Tone.FMSynth(Synthpresets[0]).chain(reverb);

      this.setState({synth, reverb});
      console.log(this.state);

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

  handleReverbInput = reverbInput => {
    this.socket.emit(`reverbchanged`, reverbInput.target.value);
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

  handleWSChangeReverb = reverbInput => {
    console.log(`reverb changed`);
    let {inputReverb, reverb, synth} = this.state;

    synth = null;
    reverb = null;

    inputReverb = reverbInput;

    reverb = new Tone.JCReverb(inputReverb).connect(Tone.Master);
    synth = new Tone.FMSynth(Synthpresets[0]).chain(reverb);

    this.setState({synth, reverb, inputReverb});

    console.log(this.state);
  }

  renderScreen() {
    const {users, notes, inputReverb} = this.state;

    if (!this.isMobile.iOS()) {
      return (
        <div>
          <div className='piano-wrapper'>
            <div className='piano'>
              {notes.map((k, i) => <Key {...k} key={i} id={i} />)}
            </div>
          </div>
          <Statusbar users={users} />
        </div>
      );
    }
    if (this.isMobile.iOS()) {
      return (
        <div className='full-screen-mobile'>
          <Controls defaultReverb={inputReverb} onChangeReverb={this.handleReverbInput} />
        </div>
      );
    }
  }

  render() {
    return (
      <main>
        {this.renderScreen()}
      </main>
    );
  }
}

export default App;
