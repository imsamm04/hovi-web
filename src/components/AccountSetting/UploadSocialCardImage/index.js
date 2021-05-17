import React, {Component} from 'react';
import {Row, Col, Upload, Button, Icon, Divider, message} from 'antd';
import {API} from 'services';
import styles from './index.less';

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props,
      isEditCardFont: false,
      isEditCardBack: false,
      isLoadingUploadFont: false,
      isLoadingUploadBack: false,
      fileUploadFont: {},
      fileUploadBack: {},
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({...nextProps})
  }

  handleEditCard = (fieldName) => this.setState({[fieldName]: !this.state[fieldName]});
  handleUpload = (nameField) => {
    const isFont = nameField === 'idCardFront';
    const fileUpload = this.state[isFont ? 'fileUploadFont' : 'fileUploadBack'];
    const isEdit = isFont ? 'isEditCardFont' : 'isEditCardBack';
    const isLoading = isFont ? 'isLoadingUploadFont' : 'isLoadingUploadBack';

    if (!fileUpload.uid) return;
    this.setState({[isLoading]: true});
    const hide = message.loading('Đang tải hình ảnh lên...', 0);

    const formData = new FormData();
    formData.append('uniqueId', fileUpload.uid);
    formData.append('typeImage', nameField);
    formData.append('photos', fileUpload.originFileObj);
    new API('user/upload').upload(formData)
      .then(async data => {
        if (data.responseStatus === 200) {
          const preview = await getBase64(fileUpload.originFileObj);
          this.setState({
            [isLoading]: false,
            [isEdit]: false,
            [nameField]: preview
          }, async () => {
            hide();
            message.success(`Cập nhật ảnh CMND ${isFont ? 'mặt trước' : 'mặt sau'} thành công!`);
          })
        } else this.setState({[isLoading]: false,},
          () => message.error(`Cập nhật ảnh CMND ${isFont ? 'mặt trước' : 'mặt sau'} thất bại!`))
      }).catch(error => {
      console.log(error);
      this.setState({[isLoading]: false},
        () => message.error(`Cập nhật ảnh CMND ${isFont ? 'mặt trước' : 'mặt sau'} thất bại!`))
    });
  };

  render() {
    const renderIdCard = (nameField) => {
      const isFont = nameField === 'idCardFront';
      const isEdit = isFont ? 'isEditCardFont' : 'isEditCardBack';
      const isEditValue = this.state[isFont ? 'isEditCardFont' : 'isEditCardBack'];

      return (
        <Row>
          <Col>
            {`${isFont ? '1. Mặt trước' : '2. Mặt sau'} `}
            {!isEditValue &&
            <a onClick={() => this.handleEditCard(isEdit)}>(Chỉnh sửa)</a>}
          </Col>
          <Col>
            {!isEditValue ?
              (
                this.state[nameField] ? <img src={this.state[nameField]} className={styles.image}/> : '(Chưa có)'
              )
              : renderUploadButton({
                data: this.state,
                nameField: nameField,
                handleUpload: this.handleUpload,
                handleEditCard: this.handleEditCard,
                onChange: (fileChange, nameFileUpload) => this.setState({[nameFileUpload]: fileChange})
              })}
          </Col>
        </Row>
      )
    };

    return (
      <div>
        {renderIdCard('idCardFront')}
        <Divider/>
        {renderIdCard('idCardBack')}
      </div>
    )
  }
};

const renderUploadButton = ({nameField, data, handleUpload, handleEditCard, onChange}) => {
  const isFont = nameField === 'idCardFront';
  const fileUpload = data[isFont ? 'fileUploadFont' : 'fileUploadBack'];
  const isLoading = data[isFont ? 'isLoadingUploadFont' : 'isLoadingUploadBack'];

  return (
    <div>
      <Upload
        accept='image/*'
        beforeUpload={() => false}
        {...fileUpload.uid ? {fileList: [fileUpload]} : {}}
        onChange={file => onChange(file.fileList ? file.fileList[0] : {}, isFont ? 'fileUploadFont' : 'fileUploadBack')}>
        <Button>
          <Icon type="upload"/> Tải lên hình ảnh
        </Button>
      </Upload>
      <div style={{marginTop: '10px'}}>
        <Button
          type='primary'
          loading={isLoading}
          onClick={() => handleUpload(nameField)}>
          {isLoading ? 'Đang tải lên...' : 'Cập nhật'}
        </Button>
        <Button
          style={{marginLeft: '10px'}}
          onClick={() => handleEditCard(isFont ? 'isEditCardFont' : 'isEditCardBack')}>
          Thoát
        </Button>
      </div>
    </div>
  )
};
