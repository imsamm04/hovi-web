import {Form, Icon, Input, Button, Rate, Row, Col, message} from 'antd';
import React, {Component} from "react";
import {API} from 'services';
import LocalStorage from "../../../utils/LocalStorage";
import {REVIEW_ROOM_STATUS} from "../../../utils/const";

const {TextArea} = Input;

class NormalReviewForm extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const {roomGroupId, reviewStatus, tenantReviewId} = this.props;
    console.log(reviewStatus);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        LocalStorage.getCurrentUser()
          .then(currentUser => {
            const data = {
              userId: currentUser.uid,
              roomGroupId: roomGroupId,
              comment: values.comment,
              accuracyStar: values.accuracyStar,
              hostStar: values.hostStar,
              securityStar: values.securityStar
            }
            if (reviewStatus == REVIEW_ROOM_STATUS.CREATE) {
              Promise.all([
                new API('tenantReview').create(data),
                new API('roomGroupDetail').get(roomGroupId)
              ])
                .then(response => {
                  const detail = response[1];
                  if (detail.responseStatus == 200) {
                    message.info("Cảm ơn đánh giá của bạn");
                    this.props.getReview(detail.data.reviewList, detail.data.rating);
                    const item = detail.data.reviewList.find(x=>x.tenantId==currentUser.uid);
                    this.props.handleUpdateReview(item.reviewId);
                  }
                  this.props.handleUpdateStatus(false);
                })
            } else if(reviewStatus==REVIEW_ROOM_STATUS.UPDATE){
              Promise.all([
                new API('tenantReview').update({id: tenantReviewId, data: data}),
                new API('roomGroupDetail').get(roomGroupId)
              ])
                .then(response => {
                  const test = response[0];
                  const detail = response[1];
                  if (detail.responseStatus == 200) {
                    message.info("Bạn đã update review thành công");
                    this.props.getReview(detail.data.reviewList, detail.data.rating);
                  }
                  this.props.handleUpdateStatus(false);
                })
            }

          })
      }
    });
  };

  componentDidMount() {
    this.props.form.setFieldsValue({
      accuracyStar: 5,
      hostStar: 5,
      securityStar: 5
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="review-form">
        <Row>
          <Col span={8}>
            <Form.Item label={'Độ chính xác'}>
              {getFieldDecorator('accuracyStar', {
                rules: [{required: false, message: 'Hãy đánh giá độ chính xác của thông tin phòng'}],
              })(
                <Rate allowClear={false}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'Chủ trọ'}>
              {getFieldDecorator('hostStar', {
                rules: [{required: false, message: 'Hãy đánh giá chủ phòng'}],
              })(
                <Rate allowClear={false}/>
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label={'An ninh'}>
              {getFieldDecorator('securityStar', {
                rules: [{required: false, message: 'Hãy đánh giá an ninh xung quanh'}],
              })(
                <Rate allowClear={false}/>
              )}
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={'Nội dung đánh giá'}>
              {getFieldDecorator('comment', {
                rules: [{required: true, message: 'Hãy để lại comment về phòng'}],
              })(
                <TextArea style={{resize: 'none'}} rows={5}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{textAlign: 'center'}}>
          <Button type="primary" htmlType="submit">
            Gửi đánh giá
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const ReviewForm = Form.create({name: 'reviewForm'})(NormalReviewForm);
export default ReviewForm;
