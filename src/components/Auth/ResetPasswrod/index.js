import React, {Component} from 'react';
import {Button, Form, Input, message} from 'antd';
import {Auth} from 'services';
import styles from './index.less';

const {Item} = Form;

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      confirmDirty: false,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        const {oobCode} = this.props.query;
        const {password} = values;
        new Auth().resetPassword({oobCode, password})
          .then(data => {
            if (data.status === 200) this.setState({isLoading: false}, () => {
              message.success('Đổi mật khẩu thành công !');
              this.props.handleCancel();
            }); else this.setState({isLoading: false}, () => {
              message.error('Đổi mật khẩu thất bại, hãy thử lại sau!');
            });
          }).catch(error => {
          const {data} = error.response;
          if (data.message === 'INVALID_OOB_CODE' || data.message === 'EXPIRED_OOB_CODE')
            this.setState({isLoading: false}, () => {
              message.error('Đường dẫn đổi mật khẩu này đã hết hạn, hãy thử lại !');
            }); else this.setState({isLoading: false}, () => {
            message.error('Đổi mật khẩu thất bại, hãy thử lại sau!');
          });
        });
      }
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
    const {isLoading} = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
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
          })(<Input.Password size='large' placeholder="Mật khẩu mới"/>)}
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

export default Form.create({name: 'ResetPassword'})(ResetPassword);
