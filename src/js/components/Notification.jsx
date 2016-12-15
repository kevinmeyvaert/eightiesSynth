// @flow
import React, {PropTypes} from 'react';
import classNames from 'classnames';

const Notification = ({midiConnected}: {midiConnected: boolean}) => {

  const notificationStyle:Object = classNames({
    notification: true,
    hidden: midiConnected === true
  });

  return (
    <div className={notificationStyle}>
      Please connect a <a href='https://www.amazon.com/M-Audio-Keystation-Mini-32-Ultra-Portable/dp/B00IWRJSE2/' target='_blank'>Keystation Mini 32</a>.
    </div>
  );
};

Notification.propTypes = {
  midiConnected: PropTypes.bool
};

export default Notification;
