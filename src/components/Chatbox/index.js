import React from 'react';
import {Divider, Card} from "antd";
import InputField from "./InputField";
import MessagesArea from './MessagesArea'
import styles from './index.less';

export default ({currentUser, currentGroupId, isHost, host, user, title}) => {
  const generateTitle = isHost ? 'Trò chuyện với khách thuê' : 'Trò chuyện với chủ phòng';

  return (
    <div className={styles.container}>
      <Card title={generateTitle} bodyStyle={{padding: 0}}>
        <div className={styles.chatContainer}>
          <div className={styles.chatChatbox}>
            <MessagesArea currentUser={currentUser} currentGroupId={currentGroupId}/>
            <Divider style={{flex: '0 0 auto', margin: '0'}}/>
            <InputField {...{currentUser, currentGroupId, host, user, title}}/>
          </div>
        </div>
      </Card>
    </div>
  )
}
