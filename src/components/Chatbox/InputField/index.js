import React, {Component} from 'react';
import {Input, notification} from 'antd';
import * as DBFirebase from 'services/DBFirebase';
import * as StorageFirebase from 'services/StorageFirebase';
import styles from './index.less';

import InputButton from './InputButton';

const {TextArea} = Input;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      roomInfo: this.reformatRoomInfo(props),
      isLoadingUploadFile: 0
    };
    this.upload = StorageFirebase.SingleUploadThread();
  }

  reformatRoomInfo = ({title, host, user}) => {
    const getDetail = (data) => ({
      id: data.id,
      avatar: data.avatar,
      displayName: `${data.firstName} ${data.lastName}`
    });

    return {
      name: title,
      host: getDetail(host),
      tenant: getDetail(user)
    }
  };

  sendMessage = () => {
    const {currentUser, currentGroupId} = this.props;
    const {message, roomInfo} = this.state;

    const messageObject = DBFirebase.makeMessage(
      DBFirebase.messageTypes.TEXT,
      message,
      currentUser
    );

    if (messageObject) DBFirebase.addMessage(currentGroupId, messageObject, roomInfo);

    this.setState({message: ''});
  };

  handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {  // if enter with no shift get pressed
      event.preventDefault();
      event.stopPropagation();
      this.sendMessage();
    }
  };

  handleUpload = async (file) => {
    if (file.size > StorageFirebase.MAXIMUM_FILE_SIZE) notification.error({
      message: 'Lỗi tải lên tệp',
      description: `Kích thước tệp không được vượt quá ${StorageFirebase.MAXIMUM_FILE_SIZE}`
    }); else {
      this.upload.onProgress(progress => this.setState({isLoadingUploadFile: progress}));
      const {roomInfo} = this.state;
      const {currentUser, currentGroupId} = this.props;
      const downloadURL = await this.upload.upFile(file, currentUser.id, currentGroupId);
      const messageObject = DBFirebase.makeMessage(
        DBFirebase.messageTypes.FILE,
        {
          name: file.name,
          downloadURL,
          type: file.type
        },
        currentUser
      );

      if (messageObject) DBFirebase.addMessage(currentGroupId, messageObject, roomInfo)
    }
  };

  render() {
    const state = this.state;

    return (
      <div className={styles.inputFieldOuterContainer}>
        <div className={styles.inputFieldContainer}>
          <TextArea
            id='input-typing-field'
            placeholder="Enter the message"
            autosize={{minRows: 1, maxRows: 4}}
            className={styles.messageInput}
            value={state.message}
            onChange={e => this.setState({message: e.target.value})}
            onKeyDown={this.handleKeyDown}
          />
          <InputButton
            onSend={this.sendMessage}
            handleUpload={this.handleUpload}
            isLoadingUploadFile={state.isLoadingUploadFile}
          />
        </div>
      </div>
    );
  }
}
