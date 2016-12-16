// @flow
import React, {PropTypes} from 'react';

import OnlineUsers from './OnlineUsers';

const Statusbar = ({users}:{users: Object}) => {

  return (
    <section className='statusbar'>
      <OnlineUsers users={users} />
    </section>
  );
};

Statusbar.propTypes = {
  users: PropTypes.array
};

export default Statusbar;
