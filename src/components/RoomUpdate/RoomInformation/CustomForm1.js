import React from 'react';
import {Form, InputNumber, Select} from 'antd';
import {CONST, formatterCurrency} from 'utils';
import styles from './index.less';
import {Editor} from "react-draft-wysiwyg";

const {Option} = Select;

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    console.log(changedFields)
    props.handleFormChange(changedFields, 'roomGroupFields');
  },
  mapPropsToFields(props) {
    return {
      area: Form.createFormField({...props.area, value: props.area.value}),
      capacity: Form.createFormField({...props.capacity, value: props.capacity.value}),
      direction: Form.createFormField({...props.direction, value: props.direction.value}),
      bedroomQuantity: Form.createFormField({...props.bedroomQuantity, value: props.bedroomQuantity.value}),
      bathroomQuantity: Form.createFormField({...props.bathroomQuantity, value: props.bathroomQuantity.value}),
      rentPrice: Form.createFormField({...props.rentPrice, value: props.rentPrice.value}),
      depositPrice: Form.createFormField({...props.depositPrice, value: props.depositPrice.value}),
      minDepositPeriod: Form.createFormField({...props.minDepositPeriod, value: props.minDepositPeriod.value}),
      description: Form.createFormField({...props.description, value: props.description.value}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;

  const formItemLayout = {
    labelCol: {
      xs: {span: 24},
      sm: {span: 7},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 17},
    },
  };

  return (
    <div>
      <Form {...formItemLayout}>
        <Form.Item label='Diện tích'>
          {getFieldDecorator('area', {
            initialValue: props.area.value,
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (value < CONST.MIN_AREA) callback(`Diện tích không được nhỏ hơn ${CONST.MIN_AREA}m².`);
                  else if (value > CONST.MAX_AREA) callback(`Diện tích không được lớn hơn ${CONST.MAX_AREA}m².`);
                  else callback();
                }
              },
            ],
          })(<div>
            <InputNumber
              type='number'
              size='large'
              min={CONST.MIN_AREA}
              max={CONST.MAX_AREA}
              value={props.area.value}/>
            <div className={styles.subInput}>m²</div>
          </div>)}
        </Form.Item>
        <Form.Item label='Số người ở'>
          {getFieldDecorator('capacity', {
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số lượng không hợp lệ.');
                  else if (value < CONST.MIN_CAPACITY) callback(`Số người ở không được nhỏ hơn ${CONST.MIN_CAPACITY}.`);
                  else if (value > CONST.MAX_CAPACITY) callback(`Số người ở không được lớn hơn ${CONST.MAX_CAPACITY}.`);
                  else callback();
                }
              },
            ]
          })(<div>
            <InputNumber
              type='number'
              size='large'
              min={CONST.MIN_CAPACITY}
              max={CONST.MAX_CAPACITY}
              value={props.capacity.value}/>
            <div className={styles.subInput}>người</div>
          </div>)}
        </Form.Item>
        <Form.Item label='Số lượng phòng ngủ'>
          {getFieldDecorator('bedroomQuantity', {
            initialValue: props.bedroomQuantity.value,
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số lượng không hợp lệ.');
                  else if (value < CONST.MIN_CAPACITY) callback(`Số lượng phòng ngủ không được nhỏ hơn ${CONST.MIN_CAPACITY}.`);
                  else if (value > CONST.MAX_CAPACITY) callback(`Số lượng phòng ngủ không được lớn hơn ${CONST.MAX_CAPACITY}.`);
                  else callback();
                }
              },
            ],
          })(<InputNumber type='number' size='large' min={CONST.MIN_CAPACITY} max={CONST.MAX_CAPACITY}/>)}
        </Form.Item>
        <Form.Item label='Số lượng phòng vệ sinh'>
          {getFieldDecorator('bathroomQuantity', {
            initialValue: props.bathroomQuantity.value,
            rules: [
              {
                required: true,
                message: ' '
              },
              {
                validator(rule, value, callback) {
                  if (!value || !value.toString().trim()) callback('Thông tin này bắt buộc.');
                  else if (!/^\d+$/.test(value)) callback('Số lượng không hợp lệ.');
                  else if (value < CONST.MIN_CAPACITY) callback(`Số lượng phòng vệ sinh không được nhỏ hơn ${CONST.MIN_CAPACITY}.`);
                  else if (value > CONST.MAX_CAPACITY) callback(`Số lượng phòng vệ sinh không được lớn hơn ${CONST.MAX_CAPACITY}.`);
                  else callback();
                }
              },
            ],
          })(<InputNumber type='number' size='large' min={CONST.MIN_CAPACITY} max={CONST.MAX_CAPACITY}/>)}
        </Form.Item>
        <Form.Item label="Hướng nhà">
          {getFieldDecorator('direction')
          (<Select
            allowClear
            size='large'
            className={styles.inputPrice}>
            {CONST.DIRECTION.map((value, index) => <Option key={index} value={value}>{value}</Option>)}
          </Select>)}
        </Form.Item>
        <Form.Item label='Tiền thuê' colon={false}>
          {getFieldDecorator('rentPrice', {
            initialValue: props.rentPrice.value,
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
              value={props.rentPrice.value}
              formatter={price => formatterCurrency(price)}
            />
            <div className={styles.subInput}>VNĐ</div>
          </div>)}
        </Form.Item>
        <Form.Item label='Tiền đặt cọc' colon={false}>
          {getFieldDecorator('depositPrice', {
            initialValue: props.depositPrice.value,
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
        <Form.Item label="Mô tả">
          <Editor
            editorState={props.description.value}
            editorStyle={editorStyles.editorClassName}
            toolbar={toolbar}
            onEditorStateChange={editorState => props.handleFormChange({
              description: {value: editorState}
            }, 'roomGroupFields')}/>
        </Form.Item>
      </Form>
    </div>
  );
});

const editorStyles = {
  editorClassName: {
    minHeight: '150px',
    border: '1px solid #e5e5e5',
    padding: '6px 11px',
    lineHeight: '20px'
  }
};
const toolbar = {
  options: ['inline', 'blockType', 'list'],
  inline: {options: ['bold', 'italic', 'underline', 'strikethrough']},
  list: {options: ['unordered', 'ordered']}
};
