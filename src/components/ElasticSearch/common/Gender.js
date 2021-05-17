import React from 'react';
import {Button, Col, Radio, Row} from 'antd';
import styles from '../FilterSearch/index.less';

export default ({gender, handleSave, handleChangeState}) => {
  const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
  };
  return (
    <Col>
      <Row>
        <Radio.Group onChange={e => handleChangeState('gender', e.target.value)} value={gender}>
          <Radio style={radioStyle} value={2}>Tất cả</Radio>
          <Radio style={radioStyle} value={0}>Nam</Radio>
          <Radio style={radioStyle} value={1}>Nữ</Radio>
        </Radio.Group>
      </Row>
      <Row>
        <Button
          type='link' className={styles.saveBtn}
          onClick={() => handleSave('gender', gender)}>Lưu</Button>
      </Row>
    </Col>
  );
}
