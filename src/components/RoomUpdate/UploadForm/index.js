import React, {Component} from 'react';
import {Col, Icon, Modal, Row, Typography, Upload, message, notification} from 'antd';
import {API} from 'services';
import styles from './index.less';

const {Text, Title} = Typography;

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: this.formatData(props.roomImages),
      removeList: []
    }
  }

  formatData = (roomImages) => roomImages.map(value => ({
    status: 'done',
    name: value.imageUrl,
    uid: value.imageId,
    url: value.imageUrl,
  }));

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({fileList: this.formatData(nextProps.roomImages)})
  }

  handlePreview = file => this.setState({previewImage: file.thumbUrl || file.url, previewVisible: true});
  handleCancel = () => this.setState({previewVisible: false});

  handleFileListChanged = fileList => this.setState({fileList});
  handleRemoveFile = file => this.setState(({removeList}) => ({removeList: [...removeList, file]}));

  handleSubmit = () => {
    const {roomGroupId, buildingId, onClose} = this.props;
    const {fileList, removeList} = this.state;

    if (fileList.length < 4) notification.error({
      placement: 'topLeft',
      message: 'Lỗi cập nhật hình ảnh',
      description: 'Bạn có ít nhất 4 hình ảnh mô tả phòng của bạn',
    }); else if (fileList.length > 8) notification.error({
      placement: 'topLeft',
      message: 'Lỗi cập nhật hình ảnh',
      description: 'Bạn chỉ được tải lên tối đa 8 hình ảnh',
    }); else {
      const hide = message.loading('Đang tải hình ảnh lên...', 0);
      const uploadList = fileList.filter(val => val.status !== 'done');

      let promise = [];
      uploadList.forEach(file => {
        const formData = new FormData();
        formData.append('roomGroupId', roomGroupId);
        formData.append('listUniqueId[]', file.uid);
        formData.append('photos', file.originFileObj);
        promise.push(new API('room-group/upload').upload(formData));
      });

      removeList.forEach(file => {
        if (file.url) promise.push(new API('roomImage').deleteImage(buildingId, file.uid))
      });

      Promise.all(promise)
        .then(async () => {
          await new API('roomImage').update({id: roomGroupId});
          hide();
          onClose();
          message.success(`Cập nhật hình ảnh thành công.`)
        }).catch(error => {
        console.log(error);
        hide();
        message.error('Có lỗi xảy ra, thử lại sau !')
      });
    }
  };

  render() {
    const {previewVisible, previewImage, fileList} = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Tải lên</div>
      </div>
    );

    return (
      <Row>
        <Col className={styles.description}>
          <Text>Hình ảnh giúp khách thuê thấy được rõ hơn trước khi đi đến quyết định thuê phòng</Text>
        </Col>
        <Col>
          <Upload
            multiple={true}
            accept='image/*'
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onPreview={this.handlePreview}
            onRemove={this.handleRemoveFile}
            onChange={({fileList}) => this.handleFileListChanged(fileList)}>
            {uploadButton}
          </Upload>
          <Modal footer={null} visible={previewVisible} onCancel={this.handleCancel}>
            <img alt="example" style={{width: '100%'}} src={previewImage}/>
          </Modal>
        </Col>
      </Row>
    );
  }
}
