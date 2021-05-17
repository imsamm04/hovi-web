import React, {Component} from 'react';
import {Button, Form, Input, Select, message} from 'antd';
import {CONST, FirebaseApp} from 'utils';
import {Auth} from 'services';
import styles from './index.less';

const {Option} = Select;
const {Item} = Form;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      isLoading: false,
      recaptchaId: '',
      error: false
    };
  }

  componentDidMount() {
    this.recaptchaVerifier = new FirebaseApp.auth.RecaptchaVerifier('recaptcha-container');
    this.provider = new FirebaseApp.auth.PhoneAuthProvider();
    this.recaptchaVerifier.verify().then(recaptchaId => this.setState({recaptchaId, error: false}));
    this.recaptchaVerifier.render().then(success => console.log(success));
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({isLoading: true});
    this.props.form.validateFieldsAndScroll((err, values) => {
      const {recaptchaId} = this.state;
      if (!recaptchaId) this.setState({error: true});
      else this.setState({error: false});

      if (!err && recaptchaId) {
        const {phoneNumber, password, email, firstName, lastName} = values;
        console.log(`+84${phoneNumber}`);
        new Auth().register({
          phoneNumber: `+84${phoneNumber}`,
          email,
          password,
          firstName,
          lastName,
        }).then(response => {
          this.setState({isLoading: false});
          if (response.status === 200)
            this.provider.verifyPhoneNumber(`+84${phoneNumber}`, this.recaptchaVerifier)
              .then(verificationId => {
                localStorage.setItem('verificationId', verificationId);
                this.props.onChangeCurrentView(CONST.VERIFY_VIEW_CODE, {
                  id: verificationId,
                  phoneNumber: `+84${phoneNumber}`,
                });
              }).catch(err => {
              console.log(err);
              this.props.onChangeCurrentView(CONST.VERIFY_VIEW_CODE, {
                phoneNumber: `+84${phoneNumber}`,
              });
            });
        }).catch(err => {
          this.setState({isLoading: false});
          const {status, data} = err.response;
          if (status === 409) {
            if (data && data.message === 'phoneNumber')
              this.props.form.setFields({
                phoneNumber: {
                  value: phoneNumber,
                  errors: [new Error('Số điện thoại đã tồn tại !')],
                },
              });
            else if (data && data.message === 'email')
              this.props.form.setFields({
                email: {
                  value: email,
                  errors: [new Error('Địa chỉ email đã tồn tại !')],
                },
              });
          }
        });
      } else this.setState({isLoading: false})
    });
  };

  handleConfirmBlur = e => this.setState({confirmDirty: this.state.confirmDirty || !!e.target.value});

  compareToFirstPassword = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu xác nhận không trùng khớp!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const {form} = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {onChangeCurrentView} = this.props;
    const {isLoading, error} = this.state;

    const prefixSelector = getFieldDecorator('prefix', {initialValue: '84'})(
      <Select size='large' style={{width: 70}}>
        <Option value="84">+84</Option>
      </Select>,
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        <Item>
          {getFieldDecorator('phoneNumber', {
            getValueFromEvent: (e) => {
              const oldValue = this.props.form.getFieldValue('phoneNumber');
              const convertedValue = Number(e.currentTarget.value);
              if (e.currentTarget.value === '') return '';
              else if (isNaN(convertedValue)) return oldValue ? Number(oldValue) : '';
              else return convertedValue;
            },
            rules: [{required: true, message: 'Vui lòng nhập số điện thoại!'}],
          })(<Input size='large' placeholder="Số điện thoại" addonBefore={prefixSelector}/>)}
        </Item>
        <Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'Địa chỉ email không hợp lệ!',
              },
              {
                required: true,
                message: 'Trường này là bắt buộc!',
              },
            ],
          })(<Input size='large' placeholder='Email'/>)}
        </Item>
        <Item>
          {getFieldDecorator('firstName', {
            rules: [{required: true, message: 'Trường này là bắt buộc!', whitespace: true}],
          })(<Input size='large' placeholder='Họ'/>)}
        </Item>
        <Item>
          {getFieldDecorator('lastName', {
            rules: [{required: true, message: 'Trường này là bắt buộc!', whitespace: true}],
          })(<Input size='large' placeholder='Tên'/>)}
        </Item>
        <Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
              {
                min: 4,
                message: 'Mật khẩu phải chứa ít nhất 4 kí tự!'
              },
              {
                validator: this.validateToNextPassword
              }
            ],
          })(<Input.Password size='large' placeholder="Mật khẩu"/>)}
        </Item>
        <Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true,
              message: 'Vui lòng xác nhận mật khẩu!',
            }, {validator: this.compareToFirstPassword}],
          })(<Input.Password size='large' placeholder="Xác nhận mật khẩu"
                             onBlur={this.handleConfirmBlur}/>)}
        </Item>
        <Item>
          <div id='recaptcha-container'/>
          {error && <div className={styles.error}>Hãy xác nhận bạn không phải là Robot!</div>}
        </Item>
        <Item>
          <Button
            size='large'
            type="danger"
            htmlType="submit"
            loading={isLoading}
            className={styles.fullWidth}>Đăng kí</Button>
        </Item>
        <Item>
          <div className={styles.divider}/>
          <span>Đã có tài khoản?</span>
          <Button
            type='link' className={styles.loginNow}
            onClick={() => onChangeCurrentView(CONST.LOGIN_VIEW_CODE)}>Đăng nhập</Button>
        </Item>
      </Form>
    );
  }
}

export default Form.create({name: 'Register'})(Register);
