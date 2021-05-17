import {Form, Icon, Input, Button, Rate, Row, Col, message} from 'antd';
import React, {Component} from "react";
import {API} from 'services';
import LocalStorage from "../../../utils/LocalStorage";

const {TextArea} = Input;

class NormalHostReviewForm extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
  }

  handleSubmit = e => {
    e.preventDefault();
    const {tenantId} = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        LocalStorage.getCurrentUser()
          .then(currentUser => {
            const data = {
              hostId: currentUser.uid,
              tenantId: tenantId,
              comment: values.comment,
            }

            new API('hostReview').create(data)
              .then(()   => {
                new API('hostReviewsOfTenant').get(tenantId)
                  .then(response => {
                    const detail = response
                    if (detail.responseStatus == 200) {
                      console.log(detail);
                      message.info("Cảm ơn đánh giá của bạn");
                      this.props.handleUpdateReviewList(detail,false)
                    }
                  })
              })
              .catch(error => {
                console.log(error);
              })
          })
      }
    })
  }

  render() {

    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} className="host-review-form">
          <Form.Item label={'Nội dung đánh giá'}>
            {getFieldDecorator('comment', {
              rules: [{required: false, message: 'Hãy để lại đánh giá về khách thuê'}],
            })(
              <TextArea style={{resize: 'none'}} rows={5}/>
            )}
          </Form.Item>
          <Form.Item style={{textAlign: 'center'}}>
            <Button type="primary" htmlType="submit">
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>

      </div>
    );
  }
}

const HostReviewForm = Form.create({name: 'hostReviewForm'})(NormalHostReviewForm);
export default HostReviewForm;
