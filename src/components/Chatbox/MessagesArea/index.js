import React, {Component} from 'react';
import * as ReactDOM from "react-dom";
import {Spin} from 'antd';
import * as DBFirebase from 'services/DBFirebase';
import styles from './index.less';

import Message from './Message';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loading: true
    };
    this.dbListener = null;
  }

  componentDidMount() {
    const {currentGroupId} = this.props;
    this.dbListener = this.listenToMessagesData(currentGroupId);
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    DBFirebase.offMessagesDataChange(this.props.currentGroupId, this.dbListener);
  }

  scrollToBottom = () => {
    const element = ReactDOM.findDOMNode(this.bottomMostNodeToScrollInto);
    element.scrollIntoView()
  };

  listenToMessagesData = (currentGroupId) => {
    return DBFirebase.onMessagesDataChange(currentGroupId, newMessages => {
      this.setState({messages: newMessages ? newMessages : [], loading: false})
    })
  };

  renderMessages = (message) => {
    switch (message.type) {
      case DBFirebase.messageTypes.TEXT:
      case DBFirebase.messageTypes.FILE:
        const {currentUser} = this.props;
        const isOwned = currentUser && message.from.uid === currentUser.uid;
        return <Message
          key={message.id}
          message={message}
          isOwned={isOwned}
        />;
      default:
        return <div key={message.id}/>
    }
  };

  render() {
    const state = this.state;

    return (
      <div className={styles.messageAreaContainer}>
        <Spin spinning={state.loading}>
          {!state.loading ?
            <p className={styles.noMessageNotif}>Hãy là người đầu tiên bắt đầu cuộc trò chuyện.</p> : ""}
          {this.state.messages.map(this.renderMessages)}
          <div ref={node => this.bottomMostNodeToScrollInto = node}/>
        </Spin>
      </div>
    );
  }
}
