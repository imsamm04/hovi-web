import React from 'react'
import UploadSocialCardImage from "../UploadSocialCardImage";
import {
  Form,
  Input,
  Button,
  Spin,
  Divider
} from 'antd';

export default Form.create({
  name: 'global_state',
  onFieldsChange(props, changedFields) {
    props.handleFormChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      phoneNumber: Form.createFormField({...props.phoneNumber}),
      email: Form.createFormField({...props.email}),
      password: Form.createFormField({...props.password}),
    };
  },
})(props => {
  const {getFieldDecorator} = props.form;
  const helpContent = () => {
    if (!props.isUpdateEmail) return <div>Hãy cập nhật email của bạn.</div>;
    else if (props.isSentEmail) return <div>Đã gửi yêu cầu xác thực vào <a>{props.email && props.email.value}</a></div>;
    else if (!props.emailVerified)
      return <Spin spinning={props.isLoadingSendEmailVerified}>
        Địa chỉ email của bạn chưa được xác thực.<br/>
        Hãy kiểm tra email của bạn hoặc ấn <a onClick={props.handleSendVerifiedEmail}>vào đây</a> để gửi lại yêu cầu xác
        thực.
      </Spin>
  };

  return (
    <Form onSubmit={props.handleSubmit}>
      <Form.Item label="Số điện thoại" validateStatus='success' hasFeedback>
        {getFieldDecorator('phoneNumber', {
          rules: [{required: true}],
        })(<Input
          disabled={true}
          size='large'
          style={{maxWidth: '500px'}}
          addonBefore={<div style={{width: 30}}>+84</div>}/>
        )}
      </Form.Item>
      <Form.Item
        label={<span>Email{!props.isEdit &&
        <span> <a onClick={() => props.handleFormChange({isEdit: true})}>(Chỉnh sửa)</a></span>}</span>}
        validateStatus={props.emailVerified ? 'success' : 'warning'}
        hasFeedback
        extra={!props.mustLogin && helpContent()}>
        {getFieldDecorator('email', {
          initialValue: props.email,
          rules: [
            {
              type: 'email',
              message: 'Địa chỉ email chưa đúng',
            },
            {
              required: true,
              message: 'Nhập vào email của bạn',
            },
          ],
        })(<Input size='large' readOnly={!props.isEdit} style={{maxWidth: '500px'}}/>)}
      </Form.Item>
      {props.mustLogin &&
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{required: true, message: 'Vui lòng nhập mật khẩu!'}],
        })(<Input.Password autoFocus={true} size='large' placeholder="Mật khẩu" style={{maxWidth: '500px'}}/>)}
      </Form.Item>}
      {props.isEdit &&
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={props.isLoadingSendEmailVerified}>
          Cập nhật email
        </Button>
        <Button style={{marginLeft: '10px'}} onClick={() => props.handleFormChange({isEdit: false})}>
          Thoát
        </Button>
      </Form.Item>}
      <Divider/>
      <Form.Item label="Hình ảnh 2 mặt chứng minh nhân dân của bạn">
        <UploadSocialCardImage
          idCardFront={props.idCardFront}
          idCardBack={props.idCardBack}/>
      </Form.Item>
    </Form>
  );
});











