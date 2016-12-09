import React, {PropTypes} from 'react';

const Reverb = ({reverbValue, onChangeReverb: handleReverbInput}) => {

  console.log(`hey`);
  console.log(reverbValue);

  return (
    <div>
      <p>Reverb</p>
      <input
        className='inputslider'
        type='range'
        min='0'
        max='0.8'
        step='0.1'
        value={reverbValue}
        onChange={handleReverbInput} />
    </div>
  );
};

Reverb.propTypes = {
  reverbValue: PropTypes.string,
  onChangeReverb: PropTypes.func
};

export default Reverb;
