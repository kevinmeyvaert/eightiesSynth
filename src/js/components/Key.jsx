import React, {PropTypes} from 'react';

const Key = ({note, color, number, played, playedby}) => {

  const userColor = {
    backgroundColor: playedby
  };

  return (
    <div style={userColor} className={played & color === `black`
      ? `key ${color} nr-${number} zwartplayed`
      : `key ${color} nr-${number}`
      && played & color === `white`
      ? `key ${color} nr-${number} witplayed`
      : `key ${color} nr-${number}`}>
      {note}
    </div>
  );
};

Key.propTypes = {
  note: PropTypes.string,
  color: PropTypes.string,
  number: PropTypes.number,
  played: PropTypes.bool,
  playedby: PropTypes.string
};

export default Key;
