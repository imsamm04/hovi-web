import React, {Component} from 'react';
import {Col, message, Row, Spin, Alert, Upload, Button} from "antd";
import CustomForm from "./form";
import LocalStorage from 'utils/LocalStorage';
import {FirebaseApp} from "utils";
import {Auth, API} from 'services';
import UserSelfie from 'assets/user-selfie.svg';
import styles from "../BasicInformation.less";

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      mustLogin: false,
      isUpdateEmail: true,
      isLoading: true,
      isSentEmail: false,
      email: {value: ''},
      emailVerified: true,
      phoneNumber: {value: ''},
      phoneNumber84: '',
      isLoadingSendEmailVerified: false,
      password: {value: ''},
      isLoadingUpload: false,
      fileUpload: {},
      idCardFront: '',
      idCardBack: '',
      selfieImage: '',
    };

    this.securityForm = React.createRef();
  }

  componentDidMount() {
    this.loadingCurrentUser(() => this.getDataUser());
  }

  handleFormChange = (fieldChanged) => this.setState({...fieldChanged});

  getDataUser = () => {
    new API('userSetting').getAll().then(async data => {
      if (data.responseStatus === 200) {
        this.setState({
          isLoading: false,
          selfieImage: data.selfieImage,
          email: data.email,
          idCardFront: data.idCardFront,
          idCardBack: data.idCardBack
        });
      } else this.setState({isLoading: false})
    }).catch(error => {
      console.log(error);
      this.setState({isLoading: false})
    });
  };

  loadingCurrentUser = (callback) => {
    FirebaseApp.auth().currentUser.reload().then(() => {
      LocalStorage.getCurrentUser().then(user => {
        if (user) {
          user.reload();
          const isUpdateEmail = user.email !== `your_email_${user.uid}@example.com`;
          console.log(`your_email_${user.uid}@example.com`);
          console.log(user.email);
          this.setState({
            isUpdateEmail,
            email: {value: user.email},
            emailVerified: user.emailVerified,
            phoneNumber84: user.phoneNumber,
            phoneNumber: {
              value: String(user.phoneNumber).replace('+84', '0')
            },
          });
          callback();
        }
      });
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.securityForm.current.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {mustLogin, phoneNumber84} = this.state;
        this.setState({isLoading: true});
        if (mustLogin) {
          new Auth().signIn({phone: phoneNumber84, password: values.password})
            .then(response => {
              FirebaseApp.auth().signInWithCustomToken(response.data.accessToken)
                .then(() => this.updateEmail(values.email))
                .catch((error) => console.log(error));
            }).catch(err => {
            if (err.response.status === 404) this.setState({isLoading: false},
              () => message.error('Mật khẩu không đúng'));
            else this.setState({isLoading: false},
              () => message.error('Có lỗi xảy ra! xin vui lòng liên hệ quản trị viên.'));
          });
        } else this.updateEmail(values.email);
      } else message.error('Thiếu thông tin cập nhật !');
    });
  };

  updateEmail = (email) => {
    FirebaseApp.auth().currentUser.updateEmail(email)
      .then(() => {
        new API('user').updateProfile({email}).then(() => {
          this.loadingCurrentUser(() => this.setState({
            isLoading: false, mustLogin: false, isEdit: false
          }, () => {
            message.success('Cập nhập thông tin tài khoản thành công !');
          }));
        });
      }).catch(error => {
      console.log(error);
      if (error.code === 'auth/requires-recent-login') this.setState({
        isLoading: false,
        mustLogin: true
      }, () => message.error('Nhập mật khẩu của bạn để cập nhật email !'));
      else if (error.code === 'auth/email-already-in-use') this.setState({
        isLoading: false,
        mustLogin: false
      }, () => message.error('Email này đã được sử dụng ở một tài khoản khác, vui lòng thử email khác !'));
      else this.setState({isLoading: false}, () => {
          message.error('Cập nhật thông tin thất bại, hãy thử lại !');
        });
    });
  };

  handleSendVerifiedEmail = () => {
    this.setState({isLoadingSendEmailVerified: true});
    FirebaseApp.auth().currentUser.sendEmailVerification({})
      .then(() => {
        message.success('Gửi xác nhận thành công, hãy kiểm tra email và xác nhận email của bạn!');
        this.setState({isLoadingSendEmailVerified: false, isSentEmail: true});
      }).catch(error => {
      console.log(error);
      this.setState({isLoadingSendEmailVerified: false});
      message.error('Gửi xác thực nhận email thất bại, hãy thử lại sau!')
    })
  };

  handleUpload = () => {
    const {fileUpload} = this.state;
    if (!fileUpload.uid) return;
    this.setState({isLoadingUpload: true});
    const formData = new FormData();
    formData.append('uniqueId', fileUpload.uid);
    formData.append('typeImage', 'selfieImage');
    formData.append('photos', fileUpload.originFileObj);
    new API('user/upload').upload(formData)
      .then(data => {
        if (data.responseStatus === 200) {
          this.setState({
            isLoading: true,
            isLoadingUpload: false,
            fileUpload: {}
          }, () => {
            this.getDataUser();
            message.success('Cập nhật ảnh selfie thành công!');
          });
        } else this.setState({isLoadingUpload: false,},
          () => message.error('Cập nhật ảnh selfie thất bại!'))
      }).catch(error => {
      console.log(error);
      this.setState({isLoadingUpload: false},
        () => message.error('Cập nhật ảnh selfie thất bại!'))
    });
  };

  render() {
    const {isLoading, fileUpload, isLoadingUpload, selfieImage} = this.state;

    return (
      <Spin spinning={isLoading}>
        <Row gutter={64}>
          <Col span={24} style={{marginBottom: '20px'}}>
            <Alert
              message="Các thông tin xác thực của bạn chỉ được tiết lộ cho chủ nhà hoặc khách thuê khi đặt cọc được xác nhận"
              type="info" showIcon/>
          </Col>
          <Col span={15} style={{borderRight: '1px solid #f4f4f4'}}>
            <CustomForm
              ref={this.securityForm}
              {...this.state}
              handleSubmit={this.handleSubmit}
              handleFormChange={this.handleFormChange}
              handleSendVerifiedEmail={this.handleSendVerifiedEmail}/>
          </Col>
          <Col span={9}>
            <AvatarView
              fileUpload={fileUpload}
              onUpload={this.handleUpload}
              isLoadingUpload={isLoadingUpload}
              onChange={data => this.setState({fileUpload: data.fileList ? data.fileList[0] : {}})}
              selfieImage={selfieImage}/>
          </Col>
        </Row>
      </Spin>
    )
  }
};

const AvatarView = ({selfieImage, fileUpload, isLoadingUpload, onChange, onUpload}) => (
  <div>
    <div className={styles.selfie}>
      <img src={selfieImage ? selfieImage : UserSelfie} alt="avatar"/>
    </div>
    <div className={styles.button_view}>
      <div style={{textAlign: 'center'}}>
        <Upload
          accept='image/*'
          beforeUpload={() => false}
          {...fileUpload.uid ? {fileList: [fileUpload]} : {}}
          onChange={onChange}>
          <Button icon="upload">Tải lên hình ảnh Selfie của bạn</Button>
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
