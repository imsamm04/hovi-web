import React, {Component} from 'react';
import {API} from 'services';
import {Spin, List, Card, Row, Col, Avatar, Button,Typography} from 'antd';
import styles from "../Roomdetail/Review/index.less";
import HostReviewForm from "../Form/HostReviewForm";
const {Title} = Typography;
class ReviewFromHost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      reviewList: [],
      canComment:'',
    }
  }

  componentDidMount() {
    this.setState({canComment:this.props.canComment});
    this.getReviewList();
  }

  getReviewList = ()=>{
    const {userId} = this.props;
    new API('hostReviewsOfTenant').get(userId)
      .then(response => {
        console.log(response);
        this.setState({
          reviewList: response,
          isLoading: false,
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleUpdateReviewList=(reviewList,canComment)=>{
    this.setState({reviewList:reviewList,canComment:canComment});
  }
  render() {
    const { userId} = this.props;
    const {canComment,reviewList,isLoading} = this.state;
    if (isLoading) return <Spin spinning={true}/>
    return (
      <div>
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
            dataSource={reviewList}
            renderItem={item => (
              <List.Item style={{border: '1px dashed #e4e4e4 !important'}}
                         key={item.host_id}>
                <Row gutter={[8, 8]}>
                  <Col span={21}>
                    <List.Item.Meta
                      avatar={<Avatar size='large' src={item.avatar}/>}
                      title={item.last_name}/>
                    {item.comment}</Col>
                  {/*<Col span={3}>{item.tenantId == currentUser.uid &&*/}
                  {/*<Button type={"default"} onClick={() => this.updateReview()}>Update</Button>}*/}
                  {/*</Col>*/}
                </Row>
              </List.Item>
            )}
          /></Card> : !canComment && <Card><Row><Col span={5}>Chưa có đánh giá</Col></Row></Card>}
        {canComment &&
        <Card>
          <Title level={4}>Đánh giá người dùng này</Title>
          <HostReviewForm tenantId={userId} handleUpdateReviewList={this.handleUpdateReviewList}/>
        </Card>
        }
      </div>
    )
  }
}

export default ReviewFromHost;
