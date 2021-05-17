import React from 'react';
import {Form, InputNumber, Typography} from 'antd';
import {CONST, formatterCurrency} from 'utils';
import styles from './index.less';

const {Title} = Typography;

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.handleFormChange(changedFields, 'roomGroupFields');
  },
  mapPropsToFields(props) {
    return {
      rentPrice: Form.createFormField({...props.rentPrice, value: props.rentPrice.value}),
      depositPrice: Form.createFormField({...props.depositPrice, value: props.depositPrice.value}),
      minDepositPeriod: Form.createFormField({...props.minDepositPeriod, value: props.minDepositPeriod.value}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;

  return (
    <div>
      <Title level={4}>Giá cho thuê</Title>
      <Form>
        <Form.Item label='Giá thuê 1 tháng' colon={false} className={styles.customItemForm}>
          {getFieldDecorator('rentPrice', {
            rules: [
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số tiền không hợp lệ.');
                  else if (value < CONST.MIN_PRICE) callback(`Tiền thuê nhà không được nhỏ hơn ${formatterCurrency(CONST.MIN_PRICE)} VNĐ.`);
                  else if (value > CONST.MAX_PRICE) callback(`Tiền thuê nhà không được lớn hơn ${formatterCurrency(CONST.MAX_PRICE)} VNĐ.`);
                  else callback();
                }
              },
            ],
            normalize: value => value.toString().replace(/,/g, ''),
          })(<div>
            <InputNumber
              size='large'
              className={styles.inputPrice}
              step={CONST.STEP}
              min={CONST.MIN_PRICE}
              max={CONST.MAX_PRICE}
              value={props.rentPrice.value}
              formatter={price => formatterCurrency(price)}
            />
            <div className={styles.subInput}>VNĐ</div>
          </div>)}
        </Form.Item>
        <Form.Item label='Tiền đặt cọc' colon={false} className={styles.customItemForm}>
          {getFieldDecorator('depositPrice', {
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số tiền không hợp lệ.');
                  else if (value < CONST.MIN_PRICE) callback(`Tiền đặt cọc không được nhỏ hơn ${formatterCurrency(CONST.MIN_PRICE)} VNĐ.`);
                  else if (value > CONST.MAX_PRICE) callback(`Tiền đặt cọc không được lớn hơn ${formatterCurrency(CONST.MAX_PRICE)} VNĐ.`);
                  else callback();
                }
              },
            ],
            normalize: value => value.toString().replace(/,/g, ''),
          })(<div>
            <InputNumber
              size='large'
              className={styles.inputPrice}
              step={CONST.STEP}
              min={CONST.MIN_PRICE}
              max={CONST.MAX_PRICE}
              value={props.depositPrice.value}
              formatter={price => formatterCurrency(price)}
            />
            <div className={styles.subInput}>VNĐ</div>
          </div>)}
        </Form.Item>
        <Form.Item label='Số tháng đặt cọc'>
          {getFieldDecorator('minDepositPeriod', {
            initialValue: props.minDepositPeriod.value,
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số tháng không hợp lệ.');
                  else if (value < CONST.MIN_DEPOSIT_PERIOD) callback(`Số tháng cọc không được nhỏ hơn ${CONST.MIN_DEPOSIT_PERIOD}.`);
                  else if (value > CONST.MAX_DEPOSIT_PERIOD) callback(`Số tháng cọc không được lớn hơn ${CONST.MAX_DEPOSIT_PERIOD}.`);
                  else callback();
                }
              },
            ],
          })(<div>
            <InputNumber
              type='number'
              size='large'
              min={CONST.MIN_DEPOSIT_PERIOD}
              max={CONST.MAX_DEPOSIT_PERIOD}
              value={props.minDepositPeriod.value}/>
            <div className={styles.subInput}>Tháng</div>
          </div>)}
        </Form.Item>
      </Form>
    </div>
  );
});
