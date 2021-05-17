import React, {Component} from 'react';
import {Col, Icon, Modal, Row, Typography, Upload} from 'antd';
import styles from './index.less';

const {Text, Title} = Typography;

export default class extends Component {
  render() {
    const {roomImagesFields, handleFormChange} = this.props;
    const {previewVisible, previewImage, singleData} = roomImagesFields;

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Tải lên</div>
      </div>
    );

    const fileList = singleData[0].map(value => value.file);

    const handleCancel = () => handleFormChange({
      ...roomImagesFields,
      previewVisible: false,
    }, 'roomImagesFields');

    const handlePreview = file => handleFormChange({
      ...roomImagesFields,
      previewImage: file.thumbUrl,
      previewVisible: true,
    }, 'roomImagesFields');

    const fileListChanged = fileList => {
      let newFileList = [];
      fileList.forEach((file, index) => {
        newFileList.push({...singleData[0][index], file});
      });

      handleFormChange({
        ...roomImagesFields,
        singleData: {0: newFileList},
      }, 'roomImagesFields');
    };

    return (
      <Row>
        <Col>
          <Title level={4}>Thêm hình ảnh</Title>
        </Col>
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
            onPreview={handlePreview}
            onChange={({fileList}) => fileListChanged(fileList)}>
            {uploadButton}
          </Upload>
          <Modal footer={null} visible={previewVisible} onCancel={handleCancel}>
            <img alt="example" style={{width: '100%'}} src={previewImage}/>
          </Modal>
        </Col>
      </Row>
    );
  }
}
