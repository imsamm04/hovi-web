import React from 'react';
import {Button, Col, Input, InputNumber, Row, Slider} from 'antd';
import {checkCompareFilter, CONST, getDefaultFilter} from 'utils';
import styles from '../FilterSearch/index.less';

const InputGroup = Input.Group;

export default class extends React.Component {
  onChangeCapacity = (input, index = null) => {
    console.log(input);
    if (index !== null && typeof input !== 'number') return;
    const {capacity, handleChangeState} = this.props;
    handleChangeState('capacity', index === null ? input : index ? [capacity[0], input] : [input, capacity[1]]);
  };

  render() {
    const {capacity, handleSave, handleChangeState} = this.props;

    let marks = {};
    marks[CONST.MIN_CAPACITY] = `${CONST.MIN_CAPACITY} Người`;
    marks[CONST.MAX_CAPACITY] = {
      style: {width: 'max-content', left: 'calc(100% - 10px)'},
      label: `${CONST.MAX_CAPACITY} Người`,
    };

    return (
      <Col className={styles.priceRow}>
        <Row>
          <Slider
            marks={marks} min={CONST.MIN_CAPACITY} max={CONST.MAX_CAPACITY} range value={capacity}
            step={1} onChange={value => this.onChangeCapacity(value)}/>
        </Row>
        <Row style={{textAlign: 'center'}}>
          <InputGroup compact>
            <InputNumber style={{width: '50%'}} value={capacity[0]}
                         onChange={value => this.onChangeCapacity(value, 0)}/>
            <InputNumber style={{width: '50%'}} value={capacity[1]}
                         onChange={value => this.onChangeCapacity(value, 1)}/>
          </InputGroup>
        </Row>
        <Row style={{marginTop: '5px'}}>
          {checkCompareFilter(capacity, 'capacity') &&
          <Button type='link'
                  className={styles.resetBtn}
                  onClick={() => handleChangeState('capacity', getDefaultFilter('capacity'))}>Reset</Button>}
          <Button type='link' className={styles.saveBtn}
                  onClick={() => handleSave('capacity', capacity)}>Lưu</Button>
        </Row>
      </Col>
    );
  }
}
