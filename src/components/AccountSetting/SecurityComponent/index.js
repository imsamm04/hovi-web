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
              () => message.error('M???t kh???u kh??ng ????ng'));
            else this.setState({isLoading: false},
              () => message.error('C?? l???i x???y ra! xin vui l??ng li??n h??? qu???n tr??? vi??n.'));
          });
        } else this.updateEmail(values.email);
      } else message.error('Thi???u th??ng tin c???p nh???t !');
    });
  };

  updateEmail = (email) => {
    FirebaseApp.auth().currentUser.updateEmail(email)
      .then(() => {
        new API('user').updateProfile({email}).then(() => {
          this.loadingCurrentUser(() => this.setState({
            isLoading: false, mustLogin: false, isEdit: false
          }, () => {
            message.success('C???p nh???p th??ng tin t??i kho???n th??nh c??ng !');
          }));
        });
      }).catch(error => {
      console.log(error);
      if (error.code === 'auth/requires-recent-login') this.setState({
        isLoading: false,
        mustLogin: true
      }, () => message.error('Nh???p m???t kh???u c???a b???n ????? c???p nh???t email !'));
      else if (error.code === 'auth/email-already-in-use') this.setState({
        isLoading: false,
        mustLogin: false
      }, () => message.error('Email n??y ???? ???????c s??? d???ng ??? m???t t??i kho???n kh??c, vui l??ng th??? email kh??c !'));
      else this.setState({isLoading: false}, () => {
          message.error('C???p nh???t th??ng tin th???t b???i, h??y th??? l???i !');
        });
    });
  };

  handleSendVerifiedEmail = () => {
    this.setState({isLoadingSendEmailVerified: true});
    FirebaseApp.auth().currentUser.sendEmailVerification({})
      .then(() => {
        message.success('G???i x??c nh???n th??nh c??ng, h??y ki???m tra email v?? x??c nh???n email c???a b???n!');
        this.setState({isLoadingSendEmailVerified: false, isSentEmail: true});
      }).catch(error => {
      console.log(error);
      this.setState({isLoadingSendEmailVerified: false});
      message.error('G???i x??c th???c nh???n email th???t b???i, h??y th??? l???i sau!')
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
            message.success('C???p nh???t ???nh selfie th??nh c??ng!');
          });
        } else this.setState({isLoadingUpload: false,},
          () => message.error('C???p nh???t ???nh selfie th???t b???i!'))
      }).catch(error => {
      console.log(error);
      this.setState({isLoadingUpload: false},
        () => message.error('C???p nh???t ???nh selfie th???t b???i!'))
    });
  };

  render() {
    const {isLoading, fileUpload, isLoadingUpload, selfieImage} = this.state;

    return (
      <Spin spinning={isLoading}>
        <Row gutter={64}>
          <Col span={24} style={{marginBottom: '20px'}}>
            <Alert
              message="C??c th??ng tin x??c th???c c???a b???n ch??? ???????c ti???t l??? cho ch??? nh?? ho???c kh??ch thu?? khi ?????t c???c ???????c x??c nh???n"
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
          <Button icon="upload">T???i l??n h??nh ???nh Selfie c???a b???n</Button>
        </Upload>
      </div>
      <Button
        type='primary'
        onClick={onUpload}
        loading={isLoadingUpload}
        className={styles.btnUpload}>{isLoadingUpload ? '??ang t???i l??n...' : 'C???p nh???t'}</Button>
    </div>
  </div>
);
