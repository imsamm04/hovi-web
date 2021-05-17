import React, {Component} from 'react';
import {Button, Form, Input, message, Divider} from 'antd';
import {CONST, FirebaseApp} from 'utils';
import {Auth} from 'services';
import classNames from 'classnames';
import styles from './index.less';

class VerifyPhoneNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      resend: false,
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

  onVerifyCode = () => {
    this.setState({isLoading: true});
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {verification, onChangeCurrentView} = this.props;
        const phoneCredential = FirebaseApp.auth.PhoneAuthProvider.credential(verification.id, String(values.code));
        FirebaseApp.auth().signInWithCredential(phoneCredential)
          .then(() => {
            console.log(new Auth());
            new Auth().verifyPhoneNumber({
              phoneNumber: `+84${verification.phoneNumber}`,
            }).then(() => {
              this.setState({isLoading: false});
              onChangeCurrentView(CONST.LOGIN_VIEW_CODE);
              localStorage.remove('verificationId');
              message.success('Xác thực số điện thoại thành công!');
            });
          }).catch(err => {
          console.log(err);
          if (err.code === 'auth/code-expired') {
            this.setState({resend: true});
            this.props.form.setFields({
              code: {
                errors: [new Error('Mã xác thực đã hết hạn, xin vui lòng ấn Gửi lại mã để xác nhận lại!')]
              },
            });
          } else if (err.code === 'auth/invalid-verification-code') {
            this.props.form.setFields({
              code: {
                errors: [new Error('Mã xác thực không hợp lệ!')]
              },
            });
          }
          this.setState({isLoading: false});
          message.error('Xác thực số điện thoại thất bại!');
        });
      } else this.setState({isLoading: false})
    });
  };

  resendCode = () => {
    const {phoneNumber} = this.props.verification;
    const {recaptchaId} = this.state;

    if (!recaptchaId || !this.recaptchaVerifier) this.setState({error: true});
    else this.setState({error: false, isLoading: true});

    if (recaptchaId) {
      this.provider.verifyPhoneNumber(`+84${phoneNumber}`, this.recaptchaVerifier)
        .then(verificationId => {
          localStorage.setItem('verificationId', verificationId);
          this.setState({resend: false, isLoading: false})
        }).catch(err => {
        this.setState({isLoading: false}, () => {
          if (err.code === 'auth/too-many-requests')
            message.error('Bạn đã gửi quá số yêu cầu cho phép, xin vui lòng thử lại sau!');
          else message.error('Đã có lỗi xảy ra, xin vui lòng thử lại sau !');
        });
      });
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    const {resend} = this.state;
    if (resend) this.resendCode();
    else this.onVerifyCode()
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {verification} = this.props;
    const {isLoading, resend, error} = this.state;
    const value = this.props.form.getFieldValue('code');

    return (
      <Form onSubmit={this.onSubmit}>
        {!resend && <p>Mã xác nhận đã gửi cho số điện thoại <a>{verification.phoneNumber}</a></p>}
        <Form.Item className={classNames(styles.inputNumber, {
          [styles.hide]: resend
        })}>
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mã xác thực.'
              },
              {
                pattern: /^\d{6}$/,
                message: 'Mã xác thực bao gồm 6 chữ số.'
              }
            ],
          })(<Input
            maxLength={6}
            size='large'
            placeholder='Mã xác thực'
            style={{textAlign: 'center'}}
            suffix={<a>{value ? value.length : 0}/6</a>}/>)}
        </Form.Item>
        <Form.Item className={classNames(styles.hide, {
          [styles.show]: resend
        })}>
          <div id='recaptcha-container'/>
          {error && <div className={styles.error}>Hãy xác nhận bạn không phải là Robot!</div>}
        </Form.Item>
        <Form.Item className={styles.inputNumber}>
          <Button
            size='large'
            type="danger"
            htmlType="submit"
            loading={isLoading}
            className={styles.inputNumber}>
            {resend ? 'Gửi lại mã xác thực' : 'Xác nhận'}
          </Button>
        </Form.Item>
        {!resend && <div>
          <Divider/>
          Chưa nhận được mã OTP? <a onClick={() => this.setState({resend: true})}>Gửi lại mã</a>
        </div>}
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({name: 'VerifyPhoneNumber'})(VerifyPhoneNumber);
export default WrappedNormalLoginForm;
