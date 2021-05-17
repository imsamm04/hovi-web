import React from 'react';
import {Form, Input, InputNumber, Radio, Select} from 'antd';
import {CONST, formatterCurrency, isObject} from 'utils';
import styles from './index.less';

const {Option} = Select;
const {TextArea} = Input;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 18},
  },
};

const CustomizedForm = Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      area: Form.createFormField({...props.area, value: props.area.value}),
      capacity: Form.createFormField({...props.capacity, value: props.capacity.value}),
      gender: Form.createFormField({...props.gender, value: props.gender.value}),
      depositPrice: Form.createFormField({...props.depositPrice, value: props.depositPrice.value}),
      rentPrice: Form.createFormField({...props.rentPrice, value: props.rentPrice.value}),
      description: Form.createFormField({...props.description, value: props.description.value}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;

  return (
    <Form {...formItemLayout}>
      <Form.Item label='Diện tích'>
        {getFieldDecorator('area', {
          initialValue: props.area.value,
          rules: [{required: true, message: 'Thông tin này bắt buộc!'}],
        })
        (<div>
          <InputNumber
            type='number'
            size='large'
            min={1}
            value={props.area.value}/>
          <div className={styles.subInput}>m²</div>
        </div>)}
      </Form.Item>
      <Form.Item label='Sức chứa'>
        {getFieldDecorator('capacity', {
          initialValue: props.capacity.value,
          rules: [{required: true, message: 'Thông tin này bắt buộc!'}],
        })
        (<div>
          <InputNumber
            type='number'
            size='large'
            min={1}
            max={20}
            value={props.capacity.value}/>
          <div className={styles.subInput}>người</div>
        </div>)}
      </Form.Item>
      <Form.Item label='Giới tính'>
        {getFieldDecorator('gender', {
          initialValue: props.gender.value,
          rules: [{required: true, message: 'Thông tin này bắt buộc!'}],
        })
        (<Radio.Group size='large'>
          <Radio value={3}>Tất cả</Radio>
          <Radio value={0}>Nam</Radio>
          <Radio value={1}>Nữ</Radio>
        </Radio.Group>)}
      </Form.Item>
      <Form.Item label='Giá thuê'>
        {getFieldDecorator('rentPrice', {
          initialValue: props.rentPrice.value,
          rules: [{required: true, message: 'Thông tin này bắt buộc!'}],
          normalize: value => value.toString().replace(/,/g, ''),
        })
        (<div>
          <InputNumber
            size='large'
            className={styles.inputPrice}
            step={CONST.STEP}
            min={CONST.MIN_PRICE}
            max={CONST.MAX_PRICE}
            formatter={price => formatterCurrency(price)}
            value={props.rentPrice.value}/>
          <div className={styles.subInput}>VNĐ</div>
        </div>)}
      </Form.Item>
      <Form.Item label='Tiền đặt cọc'>
        {getFieldDecorator('depositPrice', {
          initialValue: props.depositPrice.value,
          rules: [{required: true, message: 'Thông tin này bắt buộc!'}],
          normalize: value => value.toString().replace(/,/g, ''),
        })
        (<div>
          <InputNumber
            size='large'
            className={styles.inputPrice}
            step={CONST.STEP}
            min={CONST.MIN_PRICE}
            max={CONST.MAX_PRICE}
            formatter={price => formatterCurrency(price)}
            value={props.depositPrice.value}/>
          <div className={styles.subInput}>VNĐ</div>
        </div>)}
      </Form.Item>
      <Form.Item label='Danh sách phòng'>
        {getFieldDecorator('roomNames', {
          initialValue: props.roomNames.value.filter(room => !isObject(room)),
          rules: [{required: true, message: 'Trường này là bắt buộc!!'}],
        })
        (<Select
          mode="tags"
          size='large'
          dropdownStyle={{display: 'none'}}/>)}
      </Form.Item>
      <Form.Item label="Mô tả">
        {getFieldDecorator('description', {
          initialValue: props.description.value,
          rules: [{required: true, message: 'Thông tin này bắt buộc!'}],
        })(<Input.TextArea size='large' rows={10}/>)}
      </Form.Item>
    </Form>
  );
});

export default CustomizedForm;
