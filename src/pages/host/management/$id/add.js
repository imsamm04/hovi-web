import React, {Component} from 'react';
import {Button, Icon, Layout, message, notification, Row, Typography} from 'antd';
import {
  AmenitiesFormV2,
  InputTypePrice,
  ProcessBar,
  RoomInformationV2,
  TermsAndPrivacy,
  UploadFormV2,
} from 'components';
import {API} from 'services';
import router from 'umi/router';
import {CONST, convertForm, formatterCurrency} from 'utils';
import draftToHtml from 'draftjs-to-html';
import LocalStorage from 'utils/LocalStorage';
import SvgLogo from 'assets/logo.svg';
import styles from './add.less';
import Geocode from 'react-geocode';

Geocode.setApiKey(process.env.APIKey);
Geocode.setLanguage('vi');
Geocode.setRegion('vi');

const {Header, Content} = Layout;
const {Title} = Typography;

const defaultState = {
  roomGroupFieldsV2: {
    'roomGroupFieldsV2[0]': {
      id: {value: 0},
      gender: {value: 2},
      area: {value: 100},
      capacity: {value: 2},
      rentPrice: {value: '1500000'},
      depositPrice: {value: '1500000'},
      minDepositPeriod: {value: 1},
      direction: {value: 'all'},
      bedroomQuantity: {value: 1},
      bathroomQuantity: {value: 1},
      roomNames: {value: []},
      description: {value: ''},
    },
  },
  roomAmenitiesFieldsV2: [],
  roomAmenitiesFields: {userSelect: []},
  countId: {countArr: [0], currentCountId: 1},
  roomImagesFields: {previewVisible: false, previewImage: '', multipleData: {}},
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
      ...defaultState,
      isLoading: false,
      isDisableNext: true,
      roomAmenities: [],
      buildingId: '',
      allRoomExists: [],
      buildingName: ''
    };

    this.roomInfo = React.createRef();
    this.roomPrice = React.createRef();
    this.inputTypePrice = React.createRef();
    this.multipleRoomInfo = React.createRef();
  }

  componentDidMount() {
    LocalStorage.getRoomAmenities().then(roomAmenities => this.setState({roomAmenities}));
    const {id} = this.props.match.params;
    new API('building-by-id').get(id).then(data => {
      let allRoomExists = [];
      data.roomGroups.forEach(roomGroup => {
        const data = roomGroup.rooms.map(val => val.roomName);
        allRoomExists.push(...data);
      });
      this.setState({allRoomExists, buildingName: data.buildingName, buildingId: id});
    }).catch(error => {
      console.log(error);
      message.error('Kh??ng t??m th???y khu tr??? c???a b???n !');
      router.push('/404');
    })
  }

  handleAcceptTermOfService = () => this.setState(({isDisableNext}) => ({isDisableNext: !isDisableNext}));

  /**
   * Change detail data of state
   * @param changedFields
   * @param nameFields
   */
  handleFormChange = (changedFields, nameFields) => this.setState({
    [nameFields]: {...this.state[nameFields], ...changedFields},
  });

  /**
   * Change detail multiple data of state
   * @param indexFields
   * @param changedFields
   * @param nameFields
   */
  handleFormChangeV2 = (indexFields, changedFields, nameFields) => {
    if (changedFields.remove) {
      const dataFields = this.state[nameFields];
      delete dataFields[indexFields];
      this.setState({[nameFields]: dataFields});
    } else this.setState({
      [nameFields]: {
        ...this.state[nameFields], [indexFields]: {
          ...this.state[nameFields][indexFields],
          ...changedFields,
        },
      },
    });
  };

  /**
   * Input room group information for multiple group
   * Validate input room information form, put up message if have errors
   * @param currentStep
   */
  verifyMultipleRoomGroup1 = (currentStep) => {
    this.inputTypePrice.current.validateFieldsAndScroll(err => {
      /**
       * If form have errors
       */
      if (err) {
        let errors = {};
        const {roomGroupFieldsV2} = this.state;
        err.roomGroupFieldsV2.map((val, key) => {
          const fieldKey = Object.keys(val)[0];
          errors[`roomGroupFieldsV2[${key}]`] = {
            ...roomGroupFieldsV2[`roomGroupFieldsV2[${key}]`],
            [fieldKey]: {
              ...roomGroupFieldsV2[`roomGroupFieldsV2[${key}]`][fieldKey],
              ...val[fieldKey],
            },
          };
        });
        this.setState({
          isLoading: false,
          roomGroupFieldsV2: {...roomGroupFieldsV2, ...errors},
        }, () => message.error('L???i d??? li???u nh???p v??o !'));
      } else this.setState({isLoading: false, currentStep});
    });
  };
  verifyMultipleRoomGroup2 = (currentStep) => {
    this.multipleRoomInfo.current.validateFieldsAndScroll(err => {
      console.log(err);
      /**
       * If form have errors
       */
      if (err) {
        let errors = {};
        const {roomGroupFieldsV2} = this.state;
        err.roomGroupFieldsV2.map((val, key) => {
          const fieldKey = Object.keys(val)[0];
          errors[`roomGroupFieldsV2[${key}]`] = {
            ...roomGroupFieldsV2[`roomGroupFieldsV2[${key}]`],
            [fieldKey]: {
              ...roomGroupFieldsV2[`roomGroupFieldsV2[${key}]`][fieldKey],
              ...val[fieldKey],
            },
          };
        });
        this.setState({
          isLoading: false,
          roomGroupFieldsV2: {...roomGroupFieldsV2, ...errors},
        }, () => message.error('L???i d??? li???u nh???p v??o !'));
      } else this.setState({currentStep, isLoading: false});
    });
  };

  /**
   * Create one or list images items for roomImagesFields
   */
  defaultStateImages = () => {
    const {roomGroupFieldsV2, roomImagesFields} = this.state;
    let multipleData = {};

    /**
     * Checking building type id
     */
    Object.values(roomGroupFieldsV2).forEach(data => {
      multipleData[data.id.value] = [];
    });

    this.handleFormChange({
      ...roomImagesFields, multipleData,
    }, 'roomImagesFields');
  };

  checkEnoughImages = (currentStep) => {
    const {roomGroupFieldsV2, roomImagesFields} = this.state;

    let check = true;
    const roomGroupArr = Object.values(roomGroupFieldsV2);
    for (let i = 0; i < roomGroupArr.length; i++) {
      const imagesLength = roomImagesFields.multipleData[roomGroupArr[i].id.value].length;
      if (imagesLength < CONST.MIN_IMAGES_QUANTITY) {
        this.setState({isLoading: false}, () => {
          notification.error({
            message: `Lo???i ph??ng ${formatterCurrency(roomGroupArr[i].rentPrice.value)} VN??`,
            description: `Ch??a ????? s??? t???i thi???u ${CONST.MIN_IMAGES_QUANTITY} ???nh cho lo???i ph??ng tr??? n??y.`,
          });
        });
        check = false;
        break;
      } else if (imagesLength > CONST.MAX_IMAGES_QUANTITY) {
        this.setState({isLoading: false}, () => {
          notification.error({
            message: `Lo???i ph??ng ${formatterCurrency(roomGroupArr[i].rentPrice.value)} VN??`,
            description: `B???n ch??? ???????c t???i l??n t???i ??a ${CONST.MAX_IMAGES_QUANTITY} ???nh m?? t??? ph??ng cho thu?? c???a b???n.`,
          });
        });
        check = false;
        break;
      }
    }
    if (check) this.setState({isLoading: false, currentStep});
  };

  completeForm = () => {
    const {buildingId} = this.state;
    const hide = message.loading('??ang t???o th??ng tin l??n m??y ch???...', 0);

    this.completeRoomGroupForm(buildingId).then(() => {
      new API(`createRoomES/${buildingId}`).create().then(() => {
        hide();
        message.success('T???o th??ng tin ph??ng th??nh c??ng !');
        router.push(`/host/management/update?typeId=3&khu-tro=${buildingId}`);
      });
    });
  };

  completeRoomGroupForm = async (buildingId) => {
    let roomGroupPromise = [];
    const {roomGroupFieldsV2} = this.state;
    Object.keys(roomGroupFieldsV2).forEach(key => {
      let data = convertForm(roomGroupFieldsV2[key]);
      roomGroupPromise.push(new API('roomGroup').create({
        buildingId: buildingId,
        data: {
          ...data,
          id: 0, // reset id of roomGroup (this id only use for client fake steps)
          description: draftToHtml(data.description),
          roomNames: data.roomNames,
        },
      }));
    });

    /**
     * call api to create room group
     */
    const roomGroupResponse = await Promise.all(roomGroupPromise);
    const listRoomGroupId = roomGroupResponse.map(roomGroup => roomGroup.dataResponse.roomGroupData.id);
    const amenitiesResponse = await this.createMultipleRoomAmenities(listRoomGroupId);
    const imagesResponse = await this.createMultipleRoomImages(listRoomGroupId);
    return {roomGroupResponse, amenitiesResponse, imagesResponse};
  };

  createMultipleRoomAmenities = async (listRoomGroupId) => {
    let promise = [];
    const {roomAmenitiesFieldsV2} = this.state;

    Object.values(roomAmenitiesFieldsV2).forEach((roomAmenities, index) => {
      promise.push(new API('roomAmenities').create({
        roomGroupId: listRoomGroupId[index],
        data: roomAmenities
      }));
    });

    return Promise.all(promise);
  };

  createMultipleRoomImages = (listRoomGroupId) => {
    let promise = [];
    const {multipleData} = this.state.roomImagesFields;

    Object.values(multipleData).forEach((fileList, index) => {
      const formData = new FormData();
      formData.append('roomGroupId', listRoomGroupId[index]);
      fileList.forEach(value => {
        formData.append('listUniqueId[]', value.file.uid);
        formData.append('photos', value.file.originFileObj);
      });

      promise.push(new API('room-group/upload').upload(formData));
    });

    return Promise.all(promise);
  };

  next = () => {
    const currentStep = this.state.currentStep + 1;
    this.setState({isLoading: true});

    /**
     * Complete form create
     */
    if (currentStep === 5) this.completeForm();
    else {
      // create default state for upload images component
      if (currentStep === 2) {
        this.defaultStateImages();
        this.verifyMultipleRoomGroup2(currentStep);

      } else if (currentStep === 1) this.verifyMultipleRoomGroup1(currentStep);
      else if (currentStep === 4) this.checkEnoughImages(currentStep);
      else this.setState({isLoading: false, currentStep});
    }
  };

  prev = () => {
    const {currentStep} = this.state;
    if (!currentStep) router.goBack();
    else this.setState({currentStep: currentStep - 1});
  };

  render() {
    const {isLoading, isDisableNext, currentStep, allRoomExists, buildingName} = this.state;
    const {roomAmenities, roomImagesFields} = this.state;
    const {countId, roomGroupFieldsV2, roomAmenitiesFieldsV2} = this.state;

    const steps = [
      {
        title: 'Th??m lo???i ph??ng',
        content: <InputTypePrice
          ref={this.inputTypePrice}
          countId={countId}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChange={this.handleFormChange}
          handleFormChangeV2={this.handleFormChangeV2}/>,
      },
      {
        title: 'Th??ng tin chi ti???t c??c lo???i ph??ng',
        content: <RoomInformationV2
          allRoomExists={allRoomExists}
          ref={this.multipleRoomInfo}
          countId={countId}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChangeV2={this.handleFormChangeV2}/>,
      },
      {
        title: 'Ti???n ??ch c??c lo???i ph??ng',
        content: <AmenitiesFormV2
          amenities={roomAmenities}
          handleFormChange={this.handleFormChange}
          roomGroupFieldsV2={roomGroupFieldsV2}
          roomAmenitiesFieldsV2={roomAmenitiesFieldsV2}/>,
      },
      {
        title: 'T???i h??nh ???nh',
        content: <UploadFormV2
          countId={countId}
          buildingType={CONST.NHATRO}
          roomImagesFields={roomImagesFields}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: '??i???u kho???n s??? d???ng d???ch v???',
        content: <TermsAndPrivacy onChange={this.handleAcceptTermOfService}/>,
      },
    ];

    const completePercent = (currentStep / (steps.length - 1)) * 100;

    return (
      <Layout className={styles.layout}>
        <Header className={styles.baseHeader}>
          <ProcessBar percentage={completePercent ? (completePercent - 5) : 10}/>
          <a className={styles.baseLogo} href='/'><img src={SvgLogo} alt='logo'/></a>
          <Row type="flex" justify="space-between" align="middle" style={{width: '100%'}}>
            <Title className={styles.stepTitle} level={4}>
              {`${buildingName} > B?????c ${currentStep + 1}: ${steps[currentStep].title}`}
            </Title>
          </Row>
        </Header>
        <FormatContent>
          <div className={styles.notFixed}>{steps[currentStep].content}</div>
          <div className={styles.fixed}>
            <div className={styles.footerLine}/>
            <div className={styles.footer}>
              <Button type='link' size='large'
                      onClick={this.prev}
                      className={styles.backBtn}>
                <Icon type="left"/>
                Quay l???i
              </Button>
              <Button type='primary' size='large'
                      className={styles.nextBtn}
                      onClick={this.next} loading={isLoading}
                      disabled={currentStep === steps.length - 1 ? isDisableNext : false}>
                {currentStep === steps.length - 1 ? 'Ho??n t???t' : 'Ti???p theo'}
              </Button>
            </div>
          </div>
        </FormatContent>
      </Layout>
    );
  }
}

const FormatContent = ({children}) => {
  return (
    <Content className={styles.content}>
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.formatContainer}>
            {children}
          </div>
        </div>
        <div className={styles.subContainer}>
        </div>
      </div>
    </Content>
  );
};
