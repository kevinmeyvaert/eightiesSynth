import React, {PropTypes} from 'react';

const Slider = ({title, min, max, step, inputValue, onChangeInput: handleUserInput}) => {

  return (
    <div>
      <p>{title} <em>{inputValue}</em></p>
      <input
        className='inputslider'
        type='range'
        min={min}
        max={max}
        step={step}
        value={inputValue}
        onChange={handleUserInput} />
    </div>
  );
};

Slider.propTypes = {
  title: PropTypes.string,
  inputValue: PropTypes.string,
  onChangeInput: PropTypes.func
};

export default Slider;
