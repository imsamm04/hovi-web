import React from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  message
} from 'antd';
import {API} from 'services';

class ChangePassword extends React.Component {
  state = {
    isLoading: false,
    confirmDirty: false,
    autoCompleteResult: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        new API('auth').changePassword({
          oldPassword: values.oldPassword,
          newPassword: values.password
        }).then(data => {
          if (data.responseStatus === 200) this.setState({isLoading: false}, () => {
            this.props.form.setFieldsValue({oldPassword: '', password: '', confirm: ''});
            message.success('Cập nhật mật khẩu mới thành công !')
          }); else this.setState({isLoading: false},
            () => message.error('Mật khẩu hiện tại không đúng, vui lòng thử lại !'));
        }).catch(err => {
          console.log(err);
          this.setState({isLoading: false},
            () => message.error('Đã có lỗi xảy ra, vui lòng thử lại !'));
        })
      }
    });
  };

  handleConfirmBlur = e => {
    const {value} = e.target;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  };

  compareToFirstPassword = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Mật khẩu chưa trùng khớp với mật khẩu ở trên!');
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
    const {isLoading} = this.state;
    const {getFieldDecorator} = this.props.form;

    return (
      <Row>
        <Col span={10}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="Nhập mật khẩu hiện tại">
              {getFieldDecorator('oldPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập vào mật khẩu hiện tại!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password size='large'/>)}
            </Form.Item>
            <Form.Item label="Mật khẩu mới" hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập vào mật khẩu mới!',
                  },
                  {
                    min: 4,
                    message: 'Mật khẩu phải chứa ít nhất 4 kí tự!'
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],

              })(<Input.Password size='large'/>)}
            </Form.Item>
            <Form.Item label="Nhập lại mật khẩu" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Nhập lại mật khẩu mới!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password size='large' onBlur={this.handleConfirmBlur}/>)}
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

const WrappedRegistrationForm = Form.create()(ChangePassword);
export default WrappedRegistrationForm;
