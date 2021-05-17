import React from 'react';
import ReactDOM from 'react-dom'
import {Button} from 'antd';
import styles from './InputButton.less';

export default ({onSend, handleUpload, isLoadingUploadFile}) => {
  let fileInputNode;
  const handleFileInput = (e) => {
    let file = e.target.files[0];
    if (file) handleUpload(file);
  };

  return (
    <div className={styles.inputButton}>
      <input
        type='file'
        ref={node => fileInputNode = node}
        onChange={handleFileInput}
        style={{display: 'none'}}
      />
      <Button
        shape="circle"
        icon="paper-clip"
        size="default"
        loading={isLoadingUploadFile === 100}
        onClick={() => ReactDOM.findDOMNode(fileInputNode).click()}/>
      <Button
        type="primary"
        className={styles.sendBtn}
        onClick={onSend}>
        Send
      </Button>
    </div>
  );
}
