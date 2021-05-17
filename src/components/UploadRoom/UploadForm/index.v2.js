import React, {Component} from 'react';
import {Card, Col, Icon, Modal, Row, Typography, Upload} from 'antd';
import {CONST, formatterCurrency} from 'utils';
import styles from './index.less';

const {Text, Title} = Typography;
export default class extends Component {
  render() {
    const {roomImagesFields, handleFormChange, buildingType} = this.props;
    const {previewVisible, previewImage, multipleData} = roomImagesFields;
    const {roomGroupFieldsV2} = this.props;
    const roomGroups = Object.keys(roomGroupFieldsV2);

    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Tải lên</div>
      </div>
    );

    const handleCancel = () => handleFormChange({
      ...roomImagesFields,
      previewVisible: false,
    }, 'roomImagesFields');

    const handlePreview = file => handleFormChange({
      ...roomImagesFields,
      previewImage: file.thumbUrl,
      previewVisible: true,
    }, 'roomImagesFields');

    const fileListChanged = (fileList, roomGroupId) => {
      let newFileList = [];
      fileList.forEach((file, index) => {
        newFileList.push({...multipleData[roomGroupId][index], file});
      });

      handleFormChange({
        ...roomImagesFields,
        multipleData: {...multipleData, [roomGroupId]: newFileList},
      }, 'roomImagesFields');
    };

    return (
      <Row>
        <Col>
          <Title level={4}>Thêm hình ảnh</Title>
        </Col>
        <Col className={styles.description}>
          <Text>Hình ảnh giúp khách thuê thấy được rõ hơn trước khi đi đến quyết định thuê phòng</Text>
          <br/>
          <Text>
            {buildingType === CONST.NHATRO ? 'Bạn cần tải lên tối thiểu 4 ảnh cho mỗi loại phòng trọ.' : 'Bạn cần tải lên tối thiểu 4 ảnh.'}
          </Text>
        </Col>
        <Col>
          {roomGroups.map(key => {
            const rentPrice = roomGroupFieldsV2[key].rentPrice.value;
            const roomGroupId = roomGroupFieldsV2[key].id.value;
            const fileList = multipleData[roomGroupId].map(value => value.file);
            return (
              <Card key={key} size='small' style={{marginBottom: '10px'}} bordered={false}
                    title={buildingType === CONST.NHATRO ? `Loại ${formatterCurrency(rentPrice)} VNĐ` : null}>
                <Upload
                  accept='image/*'
                  listType="picture-card"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  multiple={true}
                  onChange={({fileList}) => fileListChanged(fileList, roomGroupId)}>
                  {uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
                  <img alt="example" style={{width: '100%'}} src={previewImage}/>
                </Modal>
              </Card>
            );
          })}
        </Col>
      </Row>
    );
  }
}
