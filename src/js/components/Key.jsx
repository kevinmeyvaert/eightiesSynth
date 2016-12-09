// @flow
import React, {PropTypes} from 'react';
import classNames from 'classnames';

const Key = ({note, color, number, played, playedby}:{note: Object, color: string, number: number, played: boolean, playedby: string}) => {

  const userColor = {
    backgroundColor: playedby
  };

  const playedCSS = classNames({
    [`key ${color} nr-${number}`]: true,
    zwartplayed: played && color === `black`,
    witplayed: played && color === `white`
  });

  return (
    <div style={userColor} className={playedCSS}>
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
