import React from 'react';
import {Typography} from 'antd';
import styles from './index.less';

const {Paragraph} = Typography;

class Index extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className={styles.title}>
        <div className={styles.content}>
          <Paragraph ellipsis={{rows: 3, expandable: false}}>{this.props.title}</Paragraph>
        </div>

      </div>
    );
  }

}

export default Index;
