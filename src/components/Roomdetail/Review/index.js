import React, {Component} from 'react';
import {Avatar, Card, Col, Icon, List, Rate, Row, Typography, Button} from 'antd';
import styles from './index.less';
import SvgIcon from '../../../assets/icons/reviews';
import ReviewForm from "../../Form/ReviewForm";
import {API} from 'services';
import LocalStorage from "../../../utils/LocalStorage";
import {REVIEW_ROOM_STATUS} from '../../../utils/const'

const listData = [];
const {Title} = Typography;
const Star = SvgIcon;

const IconText = ({type, text}) => (
  <span>
    <Icon type={type} style={{marginRight: 8}}/>
    {text}
  </span>
);

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = ({
      canComment: false,
      currentUser: '',
      reviewList: '',
      reviewStatus: REVIEW_ROOM_STATUS.CREATE,
      tenantReviewId: '',
    })
  }


  componentDidMount() {
    const {roomGroupId, reviewList} = this.props;
    LocalStorage.getCurrentUser()
      .then(currentUser => {
        if (currentUser) {
          const item = reviewList.find(x => x.tenantId == currentUser.uid);
          this.setState({
            currentUser,
            reviewList: this.props.reviewList,
            tenantReviewId: !!item ? item.reviewId : null,
          });
          new API('getCanComment').get(roomGroupId)
            .then(response => {
              this.setState({canComment: response.canComment});
            })
            .catch(error => {
              console.log(error);
            })
        }
      })
  }

  handleUpdateStatus = (canComment) => {
    this.setState({canComment: canComment});
  };

  handleUpdateReview = (tenantReviewId) => {
    this.setState({tenantReviewId: tenantReviewId});
  }
  moveComment = (arr) => {
    if (arr.length <= 0) return [];
    const index = arr.findIndex(x => x.tenantId == this.state.currentUser.uid);
    if (index == -1) return arr;
    const item = arr[index];
    arr.splice(index, 1);
    arr.splice(0, 0, item);
    return arr;
  }

  updateReview = () => {
    this.setState({canComment: true, reviewStatus: REVIEW_ROOM_STATUS.UPDATE});
  }

  render() {
    const {reviewList, rating, roomGroupId} = this.props;
    const {canComment, currentUser, reviewStatus, tenantReviewId} = this.state;
    const accuracy = parseFloat(rating.accuracy_rate);
    const host = parseFloat(rating.host_rate);
    const security = parseFloat(rating.security_rate);
    const modifiedReviewList = this.moveComment(reviewList);
    return (
      <div>
        <Title level={this.props.subTitle}>Đánh giá</Title>
        {(!!accuracy || !!host || !!security)
        && <div className={styles.rating}>
          <Card size="small" title={<div>

            <Row>
              <Col span={3} className={styles.avgRating}>
                {<span>
                  <img className={styles.star} src={SvgIcon.star}/>
                  {((accuracy + host + security) / 3).toFixed(1)}
                </span>
                }
              </Col>
              <Col span={3} className={styles.avgRating}>
                {reviewList.length + ' đánh giá'}
              </Col>
            </Row>
          </div>}>
            <Row><Col className={styles.specificRating} span={5}>Độ chính xác </Col>
              <Col>{accuracy.toFixed(1) + ' '}<Rate disabled value={accuracy}/></Col></Row>
            <Row><Col className={styles.specificRating} span={5}>Chủ thuê </Col>
              <Col>{host.toFixed(1) + ' '}<Rate disabled value={host}/></Col></Row>
            <Row><Col className={styles.specificRating} span={5}>An ninh </Col>
              <Col>{security.toFixed(1) + ' '}<Rate disabled value={security}/></Col></Row>
          </Card>

        </div>}
        {!!reviewList && reviewList.length > 0 ? <Card>
          <List
            itemLayout="vertical"
            size="large"
            pagination={reviewList.length > 5 && {
              onChange: page => {
              },
              pageSize: 5,
              className: styles.antListPagination
            }}
            dataSource={modifiedReviewList}
            renderItem={item => (
              <List.Item style={{border: '1px dashed #e4e4e4 !important'}}
                         key={item.tenantName}>
                <Row gutter={[8, 8]}>
                  <Col span={20}>
                    <List.Item.Meta
                      avatar={<Avatar size='large' src={item.tenantAvatars}/>}
                      title={item.tenantName}/>
                    {item.tenantComments}</Col>
                  <Col span={4}>{item.tenantId == currentUser.uid &&
                  <Button type='link' onClick={() => this.updateReview()}>Cập nhật đánh giá</Button>}
                  </Col>
                </Row>
              </List.Item>
            )}
          /></Card> : !canComment && <Card><Row><Col span={5}>Chưa có đánh giá</Col></Row></Card>}
        {canComment &&
        <Card style={{marginTop: '10px'}}>
          <Title level={4}>Đánh giá nhà cho thuê</Title>
          <ReviewForm
            roomGroupId={roomGroupId}
            getReview={this.props.getReview}
            reviewStatus={reviewStatus}
            tenantReviewId={tenantReviewId}
            handleUpdateStatus={this.handleUpdateStatus}
            handleUpdateReview={this.handleUpdateReview}
          />
        </Card>
        }
      </div>
    );
  }

}

export default Review;
