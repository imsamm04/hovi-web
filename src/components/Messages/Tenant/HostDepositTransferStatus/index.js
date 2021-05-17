import React from 'react';
import {Row, Col} from 'antd';
import styles from "../../../../pages/transactions/$id/index.less";

export default ()=>{
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col className={styles.highlightSuccess}>Đã nhận phòng</Col>
      </Row>
    </div>
  )
};

