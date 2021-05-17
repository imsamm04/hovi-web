import React, {Component} from 'react';
import {Typography, Row, Col, Button} from 'antd';
import ReviewLocation from '../../SearchGoogleMap/ReviewLocation';
import styles from './index.less';

const {Title} = Typography;

class Map extends Component {
  render() {
    const {address, subTitle} = this.props;

    return (
      <div>
        <Title level={subTitle}>Vị trí</Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>{`${address.ward}, ${address.district}, ${address.province}`}</Col>
          <Col span={24}>
            <ReviewLocation location={address.location}/>
            <div className={styles.parentBtn}>
              <Button className={styles.btn}>Vị trí chính xác được cung cấp sau khi đặt cọc phòng</Button>
            </div>
          </Col>
        </Row>
      </div>);
  }
}

export default Map;
