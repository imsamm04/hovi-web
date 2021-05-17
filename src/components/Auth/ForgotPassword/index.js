import React, {Component} from 'react';
import {Button, Form, Input, message} from 'antd';
import {Auth} from 'services';
import styles from './index.less';

const {Item} = Form;

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        const {email} = values;
        new Auth().forgotPassword({email})
          .then(response => {
            if (response.data.error) this.setState({isLoading: false}, () => {
              const {error} = response.data;
              console.log(error);
              this.props.handleCancel();
              message.error('Có lỗi xảy ra, hãy thử lại sau !');
            }); else this.setState({isLoading: false}, () => {
              this.props.handleCancel();
              message.success('Liên kết đã gửi đến email của bạn, vui lòng kiểm tra email để đặt lại mật khẩu');
            });
          }).catch(err => {
          this.setState({isLoading: false}, () => {
            const {data} = err.response;
            this.props.handleCancel();
            if (data.status === 404 && data.message === 'email')
              message.error('Email của bạn không liên kết với tài khoản nào của hệ thống !');
            else if (data.status === 404 && data.message === 'phoneNumber')
              message.error('Tài khoản của bạn chưa xác thực số điện thoại !');
            else message.error('Có lỗi xảy ra, vui lòng thử lại sau');
          });
        });
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const {isLoading} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'Email không hợp lệ!',
              },
              {
                required: true,
                message: 'Thông tin này bắt buộc',
              },
            ],
          })(<Input size='large' placeholder='Nhập email của bạn'/>)}
        </Form.Item>
        <Item>
          <Button
            size='large'
            type="danger"
            htmlType="submit"
            loading={isLoading}
            className={styles.loginBtn}>
            Đặt lại mật khẩu
          </Button>
        </Item>
      </Form>
    );
  }
}

export default Form.create({name: 'ForgotPassword'})(ForgotPassword);
