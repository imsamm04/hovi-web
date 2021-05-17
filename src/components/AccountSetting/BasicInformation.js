import React, {Component} from 'react';
import BasicForm from './BasicForm';
import {API} from 'services';
import {
  Button,
  Upload,
  message,
  Row,
  Col,
  Spin
} from 'antd';
import styles from './BasicInformation.less';
import {formatForm} from 'utils';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      avatar: '',
      isLoading: true,
      isLoadingUpload: false,
      fileUpload: {},
    };

    this.basicForm = React.createRef();
  }

  handleFormChange = (changed) => this.setState(({data}) => ({
    data: {...data, ...changed}
  }));

  componentDidMount() {
    new API('userSetting').getAll().then(async data => {
      if (data.responseStatus === 200) {
        console.log(data)
        this.setState({
          isLoading: false,
          data: formatForm(data),
          avatar: data.avatar,
          email: data.email
        });
      } else this.setState({isLoading: false})
    }).catch(error => {
      console.log(error);
      this.setState({isLoading: false})
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    this.basicForm.current.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({isLoading: true});
        new API('user').updateProfile(values).then(() => {
          this.setState({isLoading: false}, async () => {
            message.success('Cập nhập thông tin tài khoản thành công !');
          });
        }).catch(error => {
          console.log(error);
          this.setState({isLoading: false});
          message.error('Cập nhật thông tin thất bại, hãy thử lại !');
        })
      } else message.error('Thiếu thông tin cập nhật !');
    });
  };

  handleUpload = () => {
    const {fileUpload} = this.state;
    if (fileUpload && !fileUpload.uid) return;
    this.setState({isLoadingUpload: true});
    const formData = new FormData();
    formData.append('uniqueId', fileUpload.uid);
    formData.append('typeImage', 'avatar');
    formData.append('photos', fileUpload.originFileObj);
    new API('user/upload').upload(formData)
      .then(data => {
        if (data.responseStatus === 200) {
          this.setState({
            isLoadingUpload: false,
            fileUpload: {}
          }, async () => {
            message.success('Cập nhật ảnh đại diện thành công!');
            await this.getAvatar();
          })
        } else this.setState({isLoadingUpload: false,},
          () => message.error('Cập nhật ảnh đại diện thất bại!'))
      }).catch(error => {
      console.log(error);
      this.setState({isLoadingUpload: false},
        () => message.error('Cập nhật ảnh đại diện thất bại!'))
    });
  };

  getAvatar = async () => {
    const data = await new API('user/avatar').getAll();
    if (data.responseStatus === 200) this.setState({avatar: data.avatar});
  };

  render() {
    const {
      data,
      avatar,
      fileUpload,
      isLoading,
      isLoadingUpload,
    } = this.state;

    return (
      <Spin spinning={isLoading}>
        <Row gutter={64}>
          <Col span={15} style={{borderRight: '1px solid #f4f4f4'}}>
            <BasicForm
              ref={this.basicForm}
              {...data}
              handleSubmit={this.handleSubmit}
              handleFormChange={this.handleFormChange}/>
          </Col>
          <Col span={9}>
            <AvatarView
              fileUpload={fileUpload}
              onUpload={this.handleUpload}
              isLoadingUpload={isLoadingUpload}
              onChange={data => this.setState({fileUpload: data.fileList ? data.fileList[0] : {}})}
              avatar={avatar}/>
          </Col>
        </Row>
      </Spin>
    )
  }
};

const AvatarView = ({avatar, fileUpload, isLoadingUpload, onChange, onUpload}) => (
  <div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar"/>
    </div>
    <div className={styles.button_view}>
      <div style={{textAlign: 'center'}}>
        <Upload
          accept='image/*'
          beforeUpload={() => false}
          onChange={onChange}
          {...fileUpload.uid ? {fileList: [fileUpload]} : {}}>
          <Button icon="upload">Tải lên hình ảnh đại diện</Button>
        </Upload>
      </div>
      <Button
        type='primary'
        onClick={onUpload}
        loading={isLoadingUpload}
        className={styles.btnUpload}>{isLoadingUpload ? 'Đang tải lên...' : 'Cập nhật'}</Button>
    </div>
  </div>
);









