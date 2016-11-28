import React, {PropTypes} from 'react';

const Key = ({id, note, color}) => {
  return (
    <div className={`key ${color} ${id}`}>
      {note}
    </div>
  );
};

Key.propTypes = {
  note: PropTypes.string,
  color: PropTypes.string,
  id: PropTypes.number
};

export default Key;
