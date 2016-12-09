import React, {Component} from 'react';
import WebMidi from 'webmidi';
import Tone from 'tone';
import io from 'socket.io-client';

import Slider from '../components/slider';
import Key from '../components/key';
import Statusbar from '../components/Statusbar';

import Keylayout from '../const/keylayout';
import Synthpresets from '../const/synthpresets';

class App extends Component {

  state = {
    users: [],
    notes: Keylayout,
    synth: {},
    inputReverb: `0`,
    inputAttack: `0.1`,
    inputDecay: `0`,
    inputSustain: `5`,
    inputRelease: `0.5`,
    inputHarmonicity: `1`
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
    this.socket.on(`changeHarmonicity`, this.handleWSChangeHarmonicity);
    this.socket.on(`changeAttack`, this.handleWSChangeAttack);
    this.socket.on(`changeDecay`, this.handleWSChangeDecay);
    this.socket.on(`changeSustain`, this.handleWSChangeSustain);
    this.socket.on(`changeRelease`, this.handleWSChangeRelease);

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
    let {inputReverb} = this.state;
    const {reverb} = this.state;

    inputReverb = reverbInput;
    reverb.roomSize._gain.gain.value = Math.round(reverbInput * 10) / 10;

    this.setState({reverb, inputReverb});
  }

  handleWSChangeHarmonicity = harmonicityInput => {
    let {inputHarmonicity} = this.state;
    const {synth} = this.state;

    inputHarmonicity = harmonicityInput;
    synth.harmonicity._param.input.value = harmonicityInput;

    this.setState({synth, inputHarmonicity});
  }

  handleWSChangeAttack = attackInput => {
    let {inputAttack} = this.state;
    const {synth} = this.state;

    inputAttack = attackInput;
    synth.envelope.attack = attackInput;

    this.setState({synth, inputAttack});
  }

  handleWSChangeDecay = decayInput => {
    let {inputDecay} = this.state;
    const {synth} = this.state;

    inputDecay = decayInput;
    synth.envelope.decay = decayInput;

    this.setState({synth, inputDecay});
  }

  handleWSChangeSustain = sustainInput => {
    let {inputSustain} = this.state;
    const {synth} = this.state;

    inputSustain = sustainInput;
    synth.envelope.sustain = sustainInput;

    this.setState({synth, inputSustain});
  }

  handleWSChangeRelease = releaseInput => {
    let {inputRelease} = this.state;
    const {synth} = this.state;

    inputRelease = releaseInput;
    synth.envelope.release = releaseInput;

    this.setState({synth, inputRelease});
  }

  renderScreen() {
    const {users, notes, inputReverb, inputAttack, inputDecay, inputSustain, inputRelease, inputHarmonicity} = this.state;

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
          <Slider
            title={`Reverb`}
            inputValue={inputReverb}
            onChangeInput={this.handleReverbInput}
            min={`0`}
            max={`0.8`}
            step={`0.1`}
          />
          <Slider
            title={`harmonicity`}
            inputValue={inputHarmonicity}
            onChangeInput={this.handleHarmonicityInput}
            min={`1`}
            max={`4`}
            step={`1`}
          />
          <Slider
            title={`Attack`}
            inputValue={inputAttack}
            onChangeInput={this.handleAttackInput}
            min={`0.01`}
            max={`0.5`}
            step={`0.01`}
          />
          <Slider
            title={`Decay`}
            inputValue={inputDecay}
            onChangeInput={this.handleDecayInput}
            min={`0`}
            max={`30`}
            step={`0.5`}
          />
          <Slider
            title={`Sustain`}
            inputValue={inputSustain}
            onChangeInput={this.handleSustainInput}
            min={`1`}
            max={`100`}
            step={`0.5`}
          />
          <Slider
            title={`Release`}
            inputValue={inputRelease}
            onChangeInput={this.handleReleaseInput}
            min={`0.1`}
            max={`1`}
            step={`0.1`}
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
