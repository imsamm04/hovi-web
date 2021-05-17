import React from 'react';
import styles from './ProcessBar.less';

export default (props) => {
  return (
    <div className={styles.processBar}>
      <Filler percentage={props.percentage}/>
    </div>
  );
};

const Filler = (props) => {
  return <div className={styles.filler} style={{width: `${props.percentage}%`}}/>;
};
