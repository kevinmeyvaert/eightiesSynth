import React, {PropTypes} from 'react';

import OnlineUsers from './OnlineUsers';

const Statusbar = ({users}) => {

  const online = users.length;

  return (
    <section className='statusbar'>
      <p className='left'>{online} {online > 1 ? `users` : `user`} online | <OnlineUsers users={users} /></p>
    </section>
  );
};

Statusbar.propTypes = {
  users: PropTypes.array
};

export default Statusbar;
