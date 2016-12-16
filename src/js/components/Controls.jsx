import React, {PropTypes} from 'react';

import Slider from './Slider';

const Controls = ({
  userSlidersInput,
  onChangeReverbInput: handleReverbInput,
  onChangeHarmonicityInput: handleHarmonicityInput,
  onChangeAttackInput: handleAttackInput,
  onChangeDecayInput: handleDecayInput,
  onChangeSustainInput: handleSustainInput,
  onChangeReleaseInput: handleReleaseInput,
  onGetPreset: handleGetPreset,
  onSetPreset: handleSetPreset
}) => {

  return (
    <div className='full-screen-mobile'>
      <Slider
        title={`Reverb`}
        inputValue={userSlidersInput.reverb}
        onChangeInput={handleReverbInput}
        min={`0`}
        max={`0.8`}
        step={`0.1`}
      />
      <Slider
        title={`harmonicity`}
        inputValue={userSlidersInput.harmonicity}
        onChangeInput={handleHarmonicityInput}
        min={`1`}
        max={`4`}
        step={`1`}
      />
      <Slider
        title={`Attack`}
        inputValue={userSlidersInput.attack}
        onChangeInput={handleAttackInput}
        min={`0.1`}
        max={`1`}
        step={`0.01`}
      />
      <Slider
        title={`Decay`}
        inputValue={userSlidersInput.decay}
        onChangeInput={handleDecayInput}
        min={`0.1`}
        max={`1`}
        step={`0.01`}
      />
      <Slider
        title={`Sustain`}
        inputValue={userSlidersInput.sustain}
        onChangeInput={handleSustainInput}
        min={`0.1`}
        max={`1`}
        step={`0.01`}
      />
      <Slider
        title={`Release`}
        inputValue={userSlidersInput.release}
        onChangeInput={handleReleaseInput}
        min={`0.1`}
        max={`1`}
        step={`0.01`}
      />
      <div className='storage'>
        <button onClick={handleSetPreset} className='save'><img src='/assets/save.svg' className='icon' /></button>
        <button onClick={handleGetPreset} className='load'><img src='/assets/load.svg' className='icon' /></button>
      </div>
    </div>
  );
};

Controls.propTypes = {
  userSlidersInput: PropTypes.object,
  onChangeReverbInput: PropTypes.func,
  onChangeHarmonicityInput: PropTypes.func,
  onChangeAttackInput: PropTypes.func,
  onChangeDecayInput: PropTypes.func,
  onChangeSustainInput: PropTypes.func,
  onChangeReleaseInput: PropTypes.func,
  onSetPreset: PropTypes.func,
  onGetPreset: PropTypes.func
};

export default Controls;
