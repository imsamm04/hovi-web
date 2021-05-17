import React, {Component} from 'react';
import {Form, Row, Col, Icon, Input, Button, Checkbox,message} from 'antd';

class UploadReportForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        message.info("Báo cáo gửi lên thành công");
        this.props.handleUpdateStatus({
          visible:false,
        })
      }
    });
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    return (

      <Form onSubmit={this.handleSubmit} className="reportForm">
        <Form.Item label="Nội dung báo cáo">
          {getFieldDecorator('reportContent', {
            rules: [{required: true, message: 'Hãy nhập nội dung báo cáo phòng!'}],
          })(
            <Input.TextArea rows={10}
                            autoSize={false}
            />,
          )}
        </Form.Item>
        <Form.Item>
        <Row>
          <Col span={8}></Col>
          <Col span={8} style={{textAlign:'center'}}>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Báo cáo phòng
            </Button>
          </Col>
          <Col span={8}></Col>
        </Row>
        </Form.Item>
      </Form>
    );
  }
}

const ReportForm = Form.create({name: 'report_form'})(UploadReportForm);

export default ReportForm;
