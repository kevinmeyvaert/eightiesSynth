const Synthpresets = [
  {
    volume: 20,
    harmonicity: 4,
    modulationIndex: 10,
    detune: - 3,
    oscillator: {
      type: `saw`
    },
    envelope: {
      attack: 0.01,
      decay: 10,
      sustain: 5,
      release: 0.5
    },
    moduation: {
      type: `sine`
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 10,
      release: 2
    }
  }
];

export default Synthpresets;
