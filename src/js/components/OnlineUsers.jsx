import React, {PropTypes} from 'react';

import OnlineUser from './OnlineUser';

const OnlineUsers = ({users}) => {

  return (
    <div className='onlineusers'>
      {users.map((u, i) => <OnlineUser user={u} key={i} tel={i} />)}
    </div>
  );
};

OnlineUsers.propTypes = {
  users: PropTypes.array
};

export default OnlineUsers;
