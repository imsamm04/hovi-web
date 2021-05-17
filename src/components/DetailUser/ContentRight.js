import React, {Component} from 'react';
import {Card, Col, Tooltip, Icon, Tag} from 'antd';
import styles from './ContentRight.less';
import {ReviewFromHost} from '../../components'

const operationTabList = [
  {
    key: 'hostReview',
    tab: <span>Đánh giá của người dùng hệ thống</span>
  },
];

class ContentRight extends Component {
  constructor(props) {
    super(props);
    this.state={
      tabKey: 'hostReview'
    }
  }

  onTabChange = key => {
    this.setState({
      tabKey: key,
    });
  };
  renderChildrenByTabKey = tabKey => {
    const {dataLoading, canComment, userId} = this.props;
    if (tabKey === 'hostReview') {
      return <ReviewFromHost canComment={canComment} userId={userId}/>;
    }
    return null;
  };

  render() {

    const {tabKey} = this.state;
    return (
      <div>
        <Col lg={17} md={24}>
          <Card
            className={styles.tabsCard}
            tabList={operationTabList}
            activeTabKey={tabKey}
            onTabChange={this.onTabChange}
          >
            {this.renderChildrenByTabKey(tabKey)}
          </Card>
        </Col>
      </div>

    );
  }
}

export default ContentRight;
