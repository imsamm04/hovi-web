import React, {Component} from 'react';
import {Button, Row, Col, Upload, Modal, List} from 'antd';
import styles from './index.less';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: props.images_url.map((url, index) => ({
        url,
        uid: index,
        name: index,
        status: 'done',
      }))
    };
  }

  handleCancel = () => this.setState({previewVisible: false});
  handlePreview = url => this.setState({previewImage: url, previewVisible: true,});

  render() {
    const {previewVisible, previewImage, fileList} = this.state;
    return (
      <div>
        <List
          grid={{gutter: 8, column: 2}}
          dataSource={fileList}
          renderItem={item => (
            <List.Item onClick={() => this.handlePreview(item.url)}>
              <img className={styles.imageItem} src={item.url} alt=''/>
            </List.Item>
          )}
        />
        <Modal visible={previewVisible} closable={false} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{width: '100%'}} src={previewImage}/>
        </Modal>
      </div>
    )
  }
}



