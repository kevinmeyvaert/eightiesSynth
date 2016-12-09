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
    userSlidersInput: {}
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

    this.socket.on(`changeSliders`, this.handleWSUserInput);

    const {inputReverb} = this.state;

    // initiate FM synth + fx
    const reverb: Object = new Tone.JCReverb(inputReverb).connect(Tone.Master);
    const synth: Object = new Tone.FMSynth(Synthpresets[0]).chain(reverb);

    this.setState({synth, reverb});
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

  handleHarmonicityInput = harmonicityInput => {
    this.socket.emit(`harmonicitychanged`, harmonicityInput.target.value);
  }

  handleAttackInput = attackInput => {
    this.socket.emit(`attackchanged`, attackInput.target.value);
  }

  handleDecayInput = decayInput => {
    this.socket.emit(`decaychanged`, decayInput.target.value);
  }

  handleSustainInput = sustainInput => {
    this.socket.emit(`sustainchanged`, sustainInput.target.value);
  }

  handleReleaseInput = releaseInput => {
    this.socket.emit(`releasechanged`, releaseInput.target.value);
  }

  handleWSInit = (users: Object, userInput: Object) => {
    const {id: socketId} = this.socket;
    let {userSlidersInput} = this.state;

    users = users.map(u => {
      if (u.socketId === socketId) u.isMe = true;
      return u;
    });

    // sliders syncen met nodeserver
    userSlidersInput = userInput;

    this.setState({users, userSlidersInput});
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

  handleWSUserInput = userInput => {
    const {synth, reverb} = this.state;
    let {userSlidersInput} = this.state;

    reverb.roomSize._gain.gain.value = Math.round(userInput.reverb * 10) / 10;
    synth.harmonicity._param.input.value = userInput.harmonicity;
    synth.envelope.attack = userInput.attack;
    synth.envelope.decay = userInput.decay;
    synth.envelope.sustain = userInput.sustain;
    synth.envelope.release = userInput.release;

    // assign state values
    userSlidersInput = userInput;

    this.setState({reverb, synth, userSlidersInput});
  }

  renderScreen() {
    const {users, notes, userSlidersInput} = this.state;

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
          <Controls
            userSlidersInput={userSlidersInput}
            onChangeReverbInput={this.handleReverbInput}
            onChangeHarmonicityInput={this.handleHarmonicityInput}
            onChangeAttackInput={this.handleAttackInput}
            onChangeDecayInput={this.handleDecayInput}
            onChangeSustainInput={this.handleSustainInput}
            onChangeReleaseInput={this.handleReleaseInput}
          />
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
