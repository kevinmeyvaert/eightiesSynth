// @flow
import React, {PropTypes} from 'react';

const OnlineUser = ({user}: {user: Object}) => {

  const color: string = user.color;

  const userColor: Object = {
    backgroundColor: color,
    marginRight: `5px`,
    padding: `5px`
  };

  return (
    <div>
      <em style={userColor} className='bolletje'>
        {user.isMobile === true ? <img className='icon-inp' src='/assets/controls.svg' /> : <img className='icon' src='/assets/keyboard.svg' />}
      </em>
      <p className='subbolletje'>{user.isMe === true ? `YOU` : ``}</p>
    </div>
  );
};

OnlineUser.propTypes = {
  user: PropTypes.object,
  tel: PropTypes.number
};

export default OnlineUser;
