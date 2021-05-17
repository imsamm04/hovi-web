import React from 'react';
import {Form, InputNumber, Select, Typography} from 'antd';
import {CONST} from 'utils';
import styles from './index.less';
import {Editor} from "react-draft-wysiwyg";

const {Title} = Typography;
const {Option} = Select;

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.handleFormChange(changedFields, 'roomGroupFields');
  },
  mapPropsToFields(props) {
    return {
      area: Form.createFormField({...props.area, value: props.area.value}),
      capacity: Form.createFormField({...props.capacity, value: props.capacity.value}),
      direction: Form.createFormField({...props.direction, value: props.direction.value}),
      bedroomQuantity: Form.createFormField({...props.bedroomQuantity, value: props.bedroomQuantity.value}),
      bathroomQuantity: Form.createFormField({...props.bathroomQuantity, value: props.bathroomQuantity.value}),
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
      <Title level={4}>Thông tin chi tiết</Title>
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
            size='large'>
            {CONST.DIRECTION.map((value, index) => <Option key={index} value={value}>{value}</Option>)}
          </Select>)}
        </Form.Item>
        <Form.Item label="Mô tả">
          {getFieldDecorator('description', {
            initialValue: props.description.value,
          })(
            <Editor
              initialContentState={props.description.value}
              editorStyle={editorStyles.editorClassName}
              toolbar={toolbar}/>
          )}
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
