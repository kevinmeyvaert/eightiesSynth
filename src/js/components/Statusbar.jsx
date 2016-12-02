import React, {PropTypes} from 'react';

const Statusbar = ({users}) => {

  const online = users.length;

  return (
    <section className='statusbar'>
      <p className='left'>{online} {online > 1 ? `users` : `user`} online</p>
    </section>
  );
};

Statusbar.propTypes = {
  users: PropTypes.array
};

export default Statusbar;
