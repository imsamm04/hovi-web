import React, {Component} from 'react';
import {Button, Form, Input, message, Select, Modal} from 'antd';
import {CONST, FirebaseApp} from 'utils';
import {Auth} from 'services';
import styles from './index.less';

const {Option} = Select;
const {Item} = Form;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({isLoading: true});
    const errorLogin = (content) => {
      message.error(content);
      this.setState({isLoading: false});
    };

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {phone, password} = values;
        console.debug(values);
        new Auth().signIn({phone: `+84${phone}`, password})
          .then(response => {
            const {accessToken} = response.data;
            FirebaseApp.auth().signInWithCustomToken(accessToken)
              .then(data => {
                console.log(data.user);
                this.setState({
                  isLoading: false
                }, () => message.success('Đăng nhập thành công'));
              }).catch(function (error) {
              // Handle Errors here.
              let errorCode = error.code;
              let errorMessage = error.message;
              console.debug(errorCode);
              errorLogin(errorMessage);
            });
          }).catch(err => {
          const {data, status} = err.response;
          if (status === 404) {
            errorLogin(data.message);
          } else if (status === 403 && data.message.code === 'not_verify_phone') {
            errorLogin(data.message.message);
            this.props.onChangeCurrentView(CONST.VERIFY_VIEW_CODE, {
              id: localStorage.getItem('verificationId'),
              phoneNumber: phone
            });
          } else if (status === 403 && data.message.code === 'block') {
            errorLogin(data.message.message);
            Modal.error({
              centered: true,
              title: 'Ban quản trị thông báo',
              content: 'Tài khoản của bạn đã bị khóa vì một số lý do. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.',
            });
          } else {
            errorLogin('Có lỗi xảy ra! xin vui lòng liên hệ quản trị viên.')
          }
        });
      } else this.setState({isLoading: false})
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {onChangeCurrentView} = this.props;
    const {isLoading} = this.state;

    const prefixSelector = getFieldDecorator('prefix', {initialValue: '84'})(
      <Select size='large' style={{width: 70}}>
        <Option value="84">+84</Option>
      </Select>,
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        <Item>
          {getFieldDecorator('phone', {
            getValueFromEvent: (e) => {
              const oldValue = this.props.form.getFieldValue('phone');
              const convertedValue = Number(e.currentTarget.value);
              if (e.currentTarget.value === '') return '';
              else if (isNaN(convertedValue)) return oldValue ? Number(oldValue) : '';
              else return convertedValue;
            },
            rules: [{required: true, message: 'Vui lòng nhập số điện thoại!'}],
          })(<Input size='large' placeholder="Số điện thoại" addonBefore={prefixSelector}/>)}
        </Item>
        <Item>
          {getFieldDecorator('password', {
            rules: [{required: true, message: 'Vui lòng nhập mật khẩu!'}],
          })(<Input.Password size='large' placeholder="Mật khẩu"/>)}
          <Button
            type='link'
            className={styles.forgetPassword}
            onClick={() => onChangeCurrentView(CONST.FORGOT_PASSWORD_VIEW_CODE)}>Quên mật khẩu?</Button>
        </Item>
        <Item>
          <Button
            size='large'
            type="danger"
            htmlType="submit"
            loading={isLoading}
            className={styles.loginBtn}>
            Đăng nhập
          </Button>
        </Item>
        <Item>
          <div className={styles.divider}/>
          <span>Chưa có tài khoản?</span>
          <Button
            type='link' className={styles.registerNow}
            onClick={() => onChangeCurrentView(CONST.REGISTER_VIEW_CODE)}>Đăng kí ngay</Button>
        </Item>
      </Form>
    );
  }
}

export default Form.create({name: 'Login'})(Login);
