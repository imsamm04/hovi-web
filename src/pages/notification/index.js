import React, {Component} from 'react';
import {Tabs, Typography, List, Spin, Row, Col, Avatar, Badge, Icon, PageHeader} from 'antd';
import {ReportForm} from 'components';
import {FirebaseApp, timestampToDateTime} from 'utils';
import * as DBFirebase from 'services/DBFirebase';
import styles from './index.less';
import router from "umi/router";
import classNames from "classnames";

const {TabPane} = Tabs;
const {Paragraph} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      notification: [],
      currentUser: {},
      reportData: {},
      isReportModalOpen: false
    }
  }

  componentDidMount() {
    /**
     * Listen auth state
     * Set current user when auth changed.
     **/
    this.unsubscribe = FirebaseApp.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        const {displayName, uid} = user;
        this.setState({
          currentUser: {
            ...user,
            firstName: !!displayName ? displayName.split(',')[0] : '',
            lastName: !!displayName ? displayName.split(',')[1] : '',
          }
        }, () => this.onListenNoticeMessages(uid));
      } else this.setState({isLoading: false});
    });
  }

  componentWillUnmount() {
    /**
     * Turn off listen event when this component destroy.
     **/
    const {currentUser} = this.state;
    if (this.unsubscribe) this.unsubscribe();
    if (currentUser) DBFirebase.offNoticeListen(currentUser.uid, this.noticeMessages);
  }

  /**
   * Listen notice messages
   **/
  onListenNoticeMessages = (uid) => {
    this.noticeMessages = DBFirebase.getNoticeMessages(uid, notice => {
      this.setState({isLoading: false, notification: notice ? notice : {}});
    })
  };

  /**
   * On item notification click
   **/
  onItemClick = (item) => {
    const {uid} = this.state.currentUser;
    !item.read && DBFirebase.readNotification(uid, item.key);

    if (item.description.type === 'REPORT') this.setState({
      reportData: item,
      isReportModalOpen: true
    }); else router.push(`/transactions/${item.id}`);
  };

  render() {
    const {notification, isLoading, reportData, isReportModalOpen} = this.state;

    const noticeData = getNoticeData(Object.values(notification));
    const count = (type, name) => {
      if (!noticeData || !noticeData[type]) return name;
      else {
        const count = noticeData[type].filter(value => value.read === false).length;
        if (count > 0) return `${name} (${count})`;
        else return name;
      }
    };

    return (
      <PageHeader title={null}>
        <div className={styles.mainLayout}>
          <Spin spinning={isLoading}>
            <Tabs tabBarStyle={{textAlign: 'center'}} animated={{tabPane: false}} defaultActiveKey="1">
              <TabPane tab={count('notification', 'Thông báo')}
                       key="1">
                {ListNotification({
                  data: noticeData.notification && noticeData.notification.reverse() || [],
                  onClick: this.onItemClick,
                  emptyText: 'Không có thông báo nào'
                })}
              </TabPane>
              <TabPane tab={count('message', 'Tin nhắn')} key="2">
                {ListNotification({
                  data: noticeData.message && noticeData.message.reverse() || [],
                  onClick: this.onItemClick,
                  emptyText: 'Không có tin nhắn nào'
                })}
              </TabPane>
            </Tabs>
          </Spin>
          <ReportForm
            report={reportData}
            visible={isReportModalOpen}
            onClose={() => this.setState({isReportModalOpen: false})}/>
        </div>
      </PageHeader>
    )
  }
};

const getNoticeData = (notices) => {
  if (!notices || notices.length === 0) return {};
  else return notices.reduce((pre, data) => {
    if (!pre[data.type]) {
      pre[data.type] = [];
    }
    pre[data.type].push(data);
    return pre;
  }, {});
};

const ListNotification = ({data, onClick, emptyText}) => {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        <img src='https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg' alt="not found"/>
        <div>{emptyText}</div>
      </div>
    );
  }

  return (
    <List className={styles.list}>
      {data.map((item, i) => {
        const avatar = item.receiver ? item.receiver.avatar : null;

        const itemCls = classNames(styles.item, {
          [styles.read]: item.read,
        });
        // eslint-disable-next-line no-nested-ternary
        const leftIcon = avatar ?
          typeof avatar === 'string' ?
            <Avatar className={styles.avatar} src={avatar}/> :
            <span className={styles.iconElement}>{avatar}</span> : null;

        return (
          <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
            <List.Item.Meta
              className={styles.meta}
              avatar={leftIcon}
              title={
                <div className={styles.title}>
                  <Paragraph
                    strong
                    ellipsis={{rows: 1, expandable: false}}
                    className={classNames(styles.paragraph, {
                      [styles.report]: item.description.type === 'REPORT'
                    })}>
                    {item.description.type === 'REPORT' && <div><Icon type="warning"/>&nbsp;</div>}{item.title}
                  </Paragraph>
                  <div className={styles.extra}>{item.extra}</div>
                </div>
              }
              description={
                <Row>
                  <Col span={!item.read ? 22 : 24}>
                    <div className={styles.description}>
                      <Paragraph
                        className={styles.content}
                        ellipsis={{rows: 2, expandable: false}}>
                        {item.description.content}
                      </Paragraph>
                    </div>
                    <div className={styles.datetime}>{timestampToDateTime(item.timestamp)}</div>
                  </Col>
                  {!item.read &&
                  <Col span={2}>
                    <Badge status="error"/>
                  </Col>}
                </Row>
              }
            />
          </List.Item>
        );
      })}
    </List>
  )
};
