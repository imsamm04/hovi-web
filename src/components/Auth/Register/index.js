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
                  errors: [new Error('S??? ??i???n tho???i ???? t???n t???i !')],
                },
              });
            else if (data && data.message === 'email')
              this.props.form.setFields({
                email: {
                  value: email,
                  errors: [new Error('?????a ch??? email ???? t???n t???i !')],
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
      callback('M???t kh???u x??c nh???n kh??ng tr??ng kh???p!');
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
            rules: [{required: true, message: 'Vui l??ng nh???p s??? ??i???n tho???i!'}],
          })(<Input size='large' placeholder="S??? ??i???n tho???i" addonBefore={prefixSelector}/>)}
        </Item>
        <Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: '?????a ch??? email kh??ng h???p l???!',
              },
              {
                required: true,
                message: 'Tr?????ng n??y l?? b???t bu???c!',
              },
            ],
          })(<Input size='large' placeholder='Email'/>)}
        </Item>
        <Item>
          {getFieldDecorator('firstName', {
            rules: [{required: true, message: 'Tr?????ng n??y l?? b???t bu???c!', whitespace: true}],
          })(<Input size='large' placeholder='H???'/>)}
        </Item>
        <Item>
          {getFieldDecorator('lastName', {
            rules: [{required: true, message: 'Tr?????ng n??y l?? b???t bu???c!', whitespace: true}],
          })(<Input size='large' placeholder='T??n'/>)}
        </Item>
        <Item hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui l??ng nh???p m???t kh???u!',
              },
              {
                min: 4,
                message: 'M???t kh???u ph???i ch???a ??t nh???t 4 k?? t???!'
              },
              {
                validator: this.validateToNextPassword
              }
            ],
          })(<Input.Password size='large' placeholder="M???t kh???u"/>)}
        </Item>
        <Item hasFeedback>
          {getFieldDecorator('confirm', {
            rules: [{
              required: true,
              message: 'Vui l??ng x??c nh???n m???t kh???u!',
            }, {validator: this.compareToFirstPassword}],
          })(<Input.Password size='large' placeholder="X??c nh???n m???t kh???u"
                             onBlur={this.handleConfirmBlur}/>)}
        </Item>
        <Item>
          <div id='recaptcha-container'/>
          {error && <div className={styles.error}>H??y x??c nh???n b???n kh??ng ph???i l?? Robot!</div>}
        </Item>
        <Item>
          <Button
            size='large'
            type="danger"
            htmlType="submit"
            loading={isLoading}
            className={styles.fullWidth}>????ng k??</Button>
        </Item>
        <Item>
          <div className={styles.divider}/>
          <span>???? c?? t??i kho???n?</span>
          <Button
            type='link' className={styles.loginNow}
            onClick={() => onChangeCurrentView(CONST.LOGIN_VIEW_CODE)}>????ng nh???p</Button>
        </Item>
      </Form>
    );
  }
}

export default Form.create({name: 'Register'})(Register);
