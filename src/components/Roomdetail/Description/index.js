import React, {Component} from 'react';
import {Typography} from 'antd';
import styles from './index.less'

const {Title} = Typography;

class Amentities extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const description = this.props.description;
    return (
      <div>
        <Title level={this.props.subTitle}>Mô tả thêm</Title>
        <div className={styles.descriptionContainer}>
          {!!description ? description : <div>Không có mô tả</div>}
        </div>
      </div>
    );
  }
}

export default Amentities;
