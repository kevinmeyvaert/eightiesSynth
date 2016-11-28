import React, {PropTypes} from 'react';

const Key = ({note, color}) => {
  return (
    <div className={`key ${color} ${note}`}>
      {note}
    </div>
  );
};

Key.propTypes = {
  note: PropTypes.string,
  color: PropTypes.string
};

export default Key;
