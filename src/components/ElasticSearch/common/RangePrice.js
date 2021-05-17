import React from 'react';
import {Button, Col, Input, Row, Slider} from 'antd';
import {checkCompareFilter, CONST, formatterCurrency, getDefaultFilter} from 'utils';
import PriceInput from '../../common/PriceInput';
import styles from '../FilterSearch/index.less';

const InputGroup = Input.Group;

export default class extends React.Component {
  onChangePrice = (input, index = null) => {
    if (index !== null && typeof input !== 'number') return;
    const {price} = this.props;
    this.props.handleChangeState('price', index === null ? input : index ? [price[0], input] : [input, price[1]]);
  };

  render() {
    const {price, handleSave, handleChangeState} = this.props;

    let marks = {};
    marks[CONST.MIN_PRICE] = `${CONST.MIN_PRICE} VND`;
    marks[CONST.MAX_PRICE] = {
      style: {width: 'max-content', left: 'calc(100% - 30px)'},
      label: `${formatterCurrency(CONST.MAX_PRICE)} VND`,
    };

    return (
      <Col className={styles.priceRow}>
        <Row>
          <Slider
            marks={marks} min={CONST.MIN_PRICE} max={CONST.MAX_PRICE} range value={price}
            step={CONST.STEP} onChange={value => this.onChangePrice(value)}/>
        </Row>
        <Row style={{textAlign: 'center'}}>
          <InputGroup compact>
            <PriceInput style={{width: '50%'}} index={0} value={price} onChangePrice={this.onChangePrice}/>
            <PriceInput style={{width: '50%'}} index={1} value={price} onChangePrice={this.onChangePrice}/>
          </InputGroup>
        </Row>
        <Row style={{marginTop: '5px'}}>
          {checkCompareFilter(price, 'price') &&
          <Button type='link'
                  className={styles.resetBtn}
                  onClick={() => handleChangeState('price', getDefaultFilter('price'))}>Reset</Button>}
          <Button type='link' className={styles.saveBtn}
                  onClick={() => handleSave('price', price)}>Lưu</Button>
        </Row>
      </Col>
    );
  }
}
