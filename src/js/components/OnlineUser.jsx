// @flow
import React, {PropTypes} from 'react';

const OnlineUser = ({user, tel}: {user: Object, tel: number}) => {

  const color: string = user.color;

  const userColor: Object = {
    backgroundColor: color,
    marginRight: `5px`,
    padding: `5px`
  };

  return (
    <em style={userColor}>
      user{tel}{user.isMe === true ? ` (you)` : ``}
    </em>
  );
};

OnlineUser.propTypes = {
  user: PropTypes.object,
  tel: PropTypes.number
};

export default OnlineUser;
