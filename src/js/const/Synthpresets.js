const Synthpresets = [
  {
    volume: 20,
    harmonicity: 4,
    modulationIndex: 5,
    detune: 5,
    oscillator: {
      type: `saw`
    },
    envelope: {
      attack: 0.01,
      decay: 5,
      sustain: 5,
      release: 0.5
    },
    moduation: {
      type: `sine`
    },
    modulationEnvelope: {
      attack: 0.05,
      decay: 5,
      sustain: 0,
      release: 2
    }
  }
];

export default Synthpresets;
