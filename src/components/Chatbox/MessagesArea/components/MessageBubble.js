import React from 'react'
import Linkify from 'react-linkify'
import classNames from 'classnames';
import styles from './MessageBubble.less';

export default ({children, color, backgroundColor, isOwned, isFile}) => {
  color = color || 'black';
  backgroundColor = backgroundColor || '#EEE';
  return (
    <div
      className={classNames({
        [styles.ownedBubble]: isOwned,
        [styles.unownedBubble]: !isOwned,
      })}
      style={{color, backgroundColor}}>
      <Linkify properties={{target: '_blank'}}>
        <p className={styles.bubbleText}>
          <span className={classNames({[styles.bubbleFile]: isFile})}>{children}</span>
        </p>
      </Linkify>
    </div>
  )
}
