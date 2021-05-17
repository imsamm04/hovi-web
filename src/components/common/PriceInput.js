import React from 'react';
import {InputNumber} from 'antd/lib/index';
import {CONST, formatterCurrency, parserCurrency} from 'utils';

export default ({value, index, onChangePrice, style, size = 'default'}) => {
  const placeholder = `${index ? formatterCurrency(CONST.MAX_PRICE) : formatterCurrency(CONST.MIN_PRICE)} VND`;

  return <InputNumber
    style={style}
    size={size}
    step={CONST.STEP}
    min={CONST.MIN_PRICE}
    max={CONST.MAX_PRICE}
    value={value[index]}
    placeholder={placeholder}
    formatter={price => formatterCurrency(price)}
    parser={price => parserCurrency(price)}
    onChange={input => onChangePrice(input, index)}
  />;
}
