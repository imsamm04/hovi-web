import React, {Component} from 'react';
import {Icon, Modal} from 'antd';
import styles from './MessageBubble.less';
import MessageBubble from './MessageBubble';

export const Text = ({children, isOwned, isFile}) => isOwned ?
  <MessageBubble
    backgroundColor="#3F51B5"
    color='#fff'
    isOwned={isOwned}
    isFile={isFile}
  >{children}
  </MessageBubble> :
  <MessageBubble
    backgroundColor="#eee"
    color='#000'
    isOwned={isOwned}
    isFile={isFile}
  >{children}
  </MessageBubble>;

export class File extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  handleClick = (isVisible) => this.setState({isVisible});

  render() {
    const {isOwned, file} = this.props;
    const {isVisible} = this.state;

    const {type, downloadURL: URL} = file;

    if (type.startsWith('image')) return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <a onClick={() => this.handleClick(true)}>
          <img className={styles.messageContentImage} src={URL} alt={file.name}/>
        </a>
        <a href={URL}
           target='_blank'
           rel="noopener noreferrer"
           style={{textAlign: isOwned ? 'right' : 'left'}}
           className={styles.userName}>
          <Icon type="cloud-upload"/>
          {' '}
          {file.name}
        </a>
        <Modal
          visible={isVisible}
          onCancel={() => this.handleClick(false)}
          okButtonProps={{style: {display: 'none'}}}
          cancelButtonProps={{style: {display: 'none'}}}
          closable={false}
          footer={null}
        >
          <img style={{width: '100%', height: '100%'}} src={URL} alt='image'/>
        </Modal>
      </div>
    ); else if (type.startsWith('audio')) return (
      <audio src={URL} controls style={{width: '500px'}}>
        Your browser does not support embedded audios, but you can <a href={URL}>download it</a>
      </audio>
    ); else if (type.startsWith('video')) return (
      <video src={URL} controls height='240px'>
        Your browser does not support embedded videos, but you can <a href={URL}>download it</a>
      </video>
    ); else return (
      <Text isOwned={isOwned} isFile={true}>
        <a href={URL}>
          <Icon type="cloud-upload"/>
          {' '}
          {file.name}
        </a>
      </Text>
    )
  }
}
