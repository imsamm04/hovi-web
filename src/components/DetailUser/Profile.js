import React, {Component} from 'react';
import {Card, Col, Divider, Icon, Row} from 'antd';
import styles from './Profile.less';
import ContentRight from './ContentRight';

class Profile extends Component {

  render() {
    const {dataLoading, user_avatar, user_name, canComment, userId} = this.props;
    const confirmedItems = this.props.verification.filter(item => item.isVerified)
    return (
      <Row gutter={24}>
        <Col lg={7} md={24}>
          <Card
            bordered={false}
            style={{marginBottom: 24,}}>
            {!dataLoading ? (
              <div className={styles.ProfileStyle}>
                <div className={styles.avatarHolder}>
                  <img alt='avatar' src={user_avatar}/>
                  <div className={styles.name}>{user_name}</div>
                </div>
                <Divider dashed/>

                <div className={styles.detail}>
                  <Row>
                    <Col span={22} offset={2} className={styles.tagsTitle}>{user_name} đã xác thực:</Col>
                  </Row>
                  <Row>
                    {console.warn(confirmedItems) || confirmedItems.map((item) => (
                      <Col span={22} offset={2} key={item.name}>
                        <Col span={3} className={styles.group}>
                          <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>
                        </Col>
                        <Col span={21}>{item.name}</Col>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            ) : null}
          </Card>
        </Col>
        <ContentRight dataLoading={dataLoading} canComment={canComment} userId={userId}/>
      </Row>
    );
  }
}

export default Profile;
