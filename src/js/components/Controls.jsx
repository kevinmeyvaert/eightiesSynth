
import React, {PropTypes} from 'react';

const Controls = ({defaultReverb, onChangeReverb: handleReverbInput}) => {
  return (
    <div>
      <p>Reverb</p>
      <input
        className='inputslider'
        type='range'
        min='0'
        max='1'
        step='0.1'
        defaultValue={defaultReverb}
        onChange={handleReverbInput} />
    </div>
  );
};

Controls.propTypes = {
  defaultReverb: PropTypes.string,
  onChangeReverb: PropTypes.func
};

export default Controls;
