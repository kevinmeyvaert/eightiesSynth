import React, {PropTypes} from 'react';

const Key = ({note, color, number}) => {
  return (
    <div className={`key ${color} nr-${number}`}>
      {note}
    </div>
  );
};

Key.propTypes = {
  note: PropTypes.string,
  color: PropTypes.string,
  number: PropTypes.number
};

export default Key;
