import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

const Loader = ({spinning = true, fullScreen = false}) => {
  return (
    <div
      className={classNames(styles.loader, {
        [styles.hidden]: !spinning,
        [styles.fullScreen]: fullScreen,
      })}>
      <div className={styles.wrapper}>
        <div className={styles.inner}/>
        <div className={styles.text}>Đang tải</div>
      </div>
    </div>
  );
};

export default Loader;
