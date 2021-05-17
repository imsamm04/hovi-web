import React from 'react';
import {Col, Input, InputNumber, Row, Slider} from 'antd';
import {CONST} from 'utils';
import styles from '../FilterSearch/index.less';

const InputGroup = Input.Group;

export default class extends React.Component {
  onChangeArea = (input, index = null) => {
    if (index !== null && typeof input !== 'number') return;
    const {area, handleChangeOptionSearch} = this.props;
    handleChangeOptionSearch('area', index === null ? input : index ? [area[0], input] : [input, area[1]]);
  };

  render() {
    const {area} = this.props;

    let marks = {};
    marks[CONST.MIN_AREA] = `${CONST.MIN_AREA} m²`;
    marks[CONST.MAX_AREA] = {
      style: {width: 'max-content', left: 'calc(100% - 10px)'},
      label: `${CONST.MAX_AREA} m²`,
    };

    return (
      <Col className={styles.areaFilter}>
        <Row>
          <Slider
            marks={marks} min={CONST.MIN_AREA} max={CONST.MAX_AREA} range value={area}
            step={1} onChange={value => this.onChangeArea(value)}/>
        </Row>
        <Row style={{textAlign: 'center'}}>
          <InputGroup compact>
            <InputNumber
              min={CONST.MIN_AREA} max={CONST.MAX_AREA}
              style={{width: '50%'}} value={area[0]}
              onChange={value => this.onChangeArea(value, 0)}/>
            <InputNumber
              min={CONST.MIN_AREA} max={CONST.MAX_AREA}
              style={{width: '50%'}} value={area[1]}
              onChange={value => this.onChangeArea(value, 1)}/>
          </InputGroup>
        </Row>
      </Col>
    );
  }
}
