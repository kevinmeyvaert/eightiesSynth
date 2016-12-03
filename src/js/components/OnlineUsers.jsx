import React, {PropTypes} from 'react';

import OnlineUser from './OnlineUser';

const OnlineUsers = ({users}) => {

  return (
    <em className='onlineusers'>
      {users.map((u, i) => <OnlineUser user={u} key={i} tel={i} />)}
    </em>
  );
};

OnlineUsers.propTypes = {
  users: PropTypes.array
};

export default OnlineUsers;
