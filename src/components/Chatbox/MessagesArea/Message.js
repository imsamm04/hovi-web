import React from 'react';
import {Avatar} from 'antd';
import {timestampToDateTime} from 'utils';
import * as MessageContent from './components/MessageContent';
import styles from './Message.less';

import {messageTypes} from 'services/DBFirebase';

export default ({message, isOwned}) => {

  let messageContent;

  switch (message.type) {
    case messageTypes.TEXT:
      messageContent = <MessageContent.Text
        isOwned={isOwned}
        timestamp={message.timestamp}
      >{message.content}</MessageContent.Text>;
      break;
    case messageTypes.FILE:
      messageContent = <MessageContent.File
        isOwned={isOwned}
        timestamp={message.timestamp}
        file={message.content}/>;
      break;
    default:
      messageContent = <div>{`Undefined message type: ${message.type}`}</div>
  }

  return isOwned ? (
    <div className={styles.ownedContainer}>
      <div className={styles.ownedMessage}>
        {messageContent}
        <p className={styles.userName}>{timestampToDateTime(message.timestamp)}</p>
      </div>
    </div>
  ) : (
    <div className={styles.unownedContainer}>
      <a href="#">
        <Avatar src={message.from.avatar} size="large"/>
      </a>
      <div className={styles.unownedMessage}>
        {messageContent}
        <p className={styles.userName}>{timestampToDateTime(message.timestamp)}</p>
      </div>
    </div>
  )
}
