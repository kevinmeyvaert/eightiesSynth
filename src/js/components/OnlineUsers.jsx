// @flow
import React, {PropTypes} from 'react';

import OnlineUser from './OnlineUser';

const OnlineUsers = ({users}:{users: Object}) => {

  return (
    <em className='onlineusers'>
      {users.map((u: Object, i: number) => <OnlineUser user={u} key={i} />)}
    </em>
  );
};

OnlineUsers.propTypes = {
  users: PropTypes.array
};

export default OnlineUsers;
