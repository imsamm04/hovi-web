import React from 'react'
import 'antd/dist/antd.css';
import {
  Form,
  Input,
  Select,
  Button,
} from 'antd';

const {Option} = Select;

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.handleFormChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      firstName: Form.createFormField({...props.firstName}),
      lastName: Form.createFormField({...props.lastName}),
      address: Form.createFormField({...props.address}),
      gender: Form.createFormField({...props.gender}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;

  return (
    <Form onSubmit={props.handleSubmit}>
      <Form.Item label="Họ">
        {getFieldDecorator('firstName', {
          rules: [{required: true, message: 'Nhập vào Tên của bạn!'}],
        })(<Input size='large' style={{maxWidth: '500px'}}/>)}
      </Form.Item>
      <Form.Item label="Tên">
        {getFieldDecorator('lastName', {
          rules: [{required: true, message: 'Nhập vào họ của bạn!'}],
        })(<Input size='large' style={{maxWidth: '500px'}}/>)}
      </Form.Item>
      <Form.Item label="Giới tính">
        {getFieldDecorator('gender', {
          initialValue: props.gender,
        })(
          <Select
            size='large'
            style={{maxWidth: '500px'}}>
            <Option value={2}>Chưa xác định</Option>
            <Option value={1}>Nam</Option>
            <Option value={0}>Nữ</Option>
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Địa chỉ">
        {getFieldDecorator('address', {
          rules: [{required: true, message: 'Nhập vào địa chỉ của bạn!'}],
          initialValue: props.address
        })(<Input size='large' style={{maxWidth: '500px'}}/>)}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Cập nhật thông tin
        </Button>
      </Form.Item>
    </Form>
  );
});











