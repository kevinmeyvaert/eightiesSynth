
import React, {PropTypes} from 'react';

const Controls = ({defaultReverb, onChangeReverb: handleReverbInput}) => {
  return (
    <div>
      <p>EDMify</p>
      <input
        className='inputslider'
        type='range'
        min='0'
        max='0.9'
        step='0.9'
        value={defaultReverb}
        onChange={handleReverbInput} />
    </div>
  );
};

Controls.propTypes = {
  defaultReverb: PropTypes.string,
  onChangeReverb: PropTypes.func
};

export default Controls;
