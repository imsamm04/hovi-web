import React, {Component} from 'react';
import {Button, Icon, Layout, message, Modal, notification, Row, Typography} from 'antd';
import {
  AmenitiesForm,
  AmenitiesFormV2,
  BuildingForm,
  CheckPinGoogleMap,
  InputTypePrice,
  ProcessBar,
  RoomInformation,
  RoomInformationV2,
  RoomPrice,
  RoomServiceForm,
  TermsAndPrivacy,
  UploadFormV2,
} from 'components';
import {API} from 'services';
import router from 'umi/router';
import {compareAddress, CONST, convertForm, formatterCurrency} from 'utils';
import draftToHtml from 'draftjs-to-html';
import LocalStorage from 'utils/LocalStorage';
import SvgLogo from 'assets/logo.svg';
import styles from './index.less';
import Geocode from 'react-geocode';

Geocode.setApiKey(process.env.APIKey);
Geocode.setLanguage('vi');
Geocode.setRegion('vi');

const {Header, Content} = Layout;
const {Title} = Typography;
const {confirm} = Modal;

const defaultState = {
  buildingFields: {
    typeId: {value: ''},
    buildingName: {value: ''},
    floorQuantity: {value: 1},
    province: {value: ''},
    district: {value: ''},
    ward: {value: ''},
    detailedAddress: {value: ''},
    addressDescription: {value: ''},
    location: {value: {}},
  },
  roomGroupFields: {
    area: {value: 100},
    capacity: {value: 2},
    rentPrice: {value: '1500000'},
    depositPrice: {value: '1500000'},
    minDepositPeriod: {value: 1},
    direction: {value: ''},
    bedroomQuantity: {value: 1},
    bathroomQuantity: {value: 1},
    roomNames: {value: []},
    description: {value: ''},
    gender: {value: 2},
  },
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
  buildingServicesFields: {data: {}, activeServices: []},
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
      buildingTypes: [],
      buildingServices: [],
      roomAmenities: [],
      buildingId: '',
      vnLocations: {
        provinces: [],
        districts: [],
        wards: [],
      },
    };

    this.buildingForm = React.createRef();
    this.roomInfo = React.createRef();
    this.roomPrice = React.createRef();
    this.inputTypePrice = React.createRef();
    this.multipleRoomInfo = React.createRef();
  }

  componentDidMount() {
    LocalStorage.getLocationProvinces().then(provinces => this.setState({vnLocations: {provinces}}));
    LocalStorage.getRoomTypes().then(buildingTypes => this.setState({buildingTypes}));
    LocalStorage.getRoomAmenities().then(roomAmenities => this.setState({roomAmenities}));
    LocalStorage.getBuildingServices().then(buildingServices => this.setState({buildingServices}));
  }

  handleAcceptTermOfService = () => this.setState(({isDisableNext}) => ({isDisableNext: !isDisableNext}));

  /**
   * Change detail data of state
   * @param changedFields
   * @param nameFields
   */
  handleFormChange = (changedFields, nameFields) => {
    const {province, district} = this.state.buildingFields;

    /**
     * If province changed, reset list districts & wards data
     */
    if (changedFields.province && changedFields.province.value[1] !== province.value[1]) {
      LocalStorage.getDistrictById(changedFields.province.value[1])
        .then(districts => this.setState(({vnLocations}) => ({
          vnLocations: {...vnLocations, districts},
          [nameFields]: {
            ...this.state[nameFields],
            ...changedFields,
            district: {value: ''},
            ward: {value: ''},
          },
        })));
    }
    /**
     * If district changed, reset list wards data
     */
    else if (changedFields.district && changedFields.district.value[1] !== district.value[1]) {
      LocalStorage.getWardById(changedFields.district.value[1])
        .then(wards => this.setState(({vnLocations}) => ({
          vnLocations: {...vnLocations, wards},
          [nameFields]: {
            ...this.state[nameFields],
            ...changedFields,
            ward: {value: ''},
          },
        })));
    }
    /**
     * Default change state
     * Allow change item of state
     */
    else this.setState({
        [nameFields]: {...this.state[nameFields], ...changedFields},
      });
  };

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
   * Verify address of user input by Google Map
   * Check error if cannot find address in Google Map
   * @param currentStep
   */
  verifyAddress = (currentStep) => {
    this.buildingForm.current.validateFieldsAndScroll((err, values) => {
      const {detailedAddress, province, district} = values;
      const findAddress = `${detailedAddress}, ${province[0]}, ${district[0]}`;
      /**
       * Validate input building form
       * Put up message when have validate errors
       */
      if (err) this.setState({isLoading: false}, () => message.error('Lỗi dữ liệu nhập vào !'));
      /**
       * Validate success & no errors of building form
       */
      else Geocode.fromAddress(findAddress).then(response => {
          const {lat, lng} = response.results[0].geometry.location;

          /**
           * Checking address get from Google Map is matching province, district, ward
           */
          if (!compareAddress(response.results[0].address_components, {province: province[0], district: district[0]}))
            confirm({
              title: 'Cảnh báo', okText: 'Tiếp tục', cancelText: 'Không',
              content: 'Thông tin địa chỉ chi tiết không trùng khớp với các trường bạn đã nhập ở trên, bạn vẫn tiếp tục sử dụng địa chỉ này chứ?',
              onCancel: () => this.setState({isLoading: false}),
              onOk: () => this.setState(({buildingFields}) => ({
                currentStep,
                isLoading: false,
                buildingFields: {...buildingFields, location: {value: {lat, lng}}},
              })),
            }); else this.setState(({buildingFields}) => ({
            currentStep,
            isLoading: false,
            buildingFields: {...buildingFields, location: {value: {lat, lng}}},
          }));
        }, () => this.setState(({buildingFields}) => ({
          isLoading: false,
          buildingFields: {
            ...buildingFields,
            detailedAddress: {
              ...buildingFields.detailedAddress,
              errors: [new Error('Chúng tôi không thể xác thực địa chỉ của bạn. Kiểm tra kỹ địa chỉ chi tiết của bạn và thử lại.')],
            },
          },
        })),
      );
    });
  };

  /**
   * Validate room group form, put up message if have errors
   * @param currentStep
   */
  verifyRoomGroup1 = (currentStep) => {
    this.roomInfo.current.validateFieldsAndScroll((err) => {
      if (err) this.setState({isLoading: false}, () => message.error('Lỗi dữ liệu nhập vào !'));
      else this.setState({isLoading: false, currentStep});
    });
  };

  verifyRoomGroup2 = (currentStep) => {
    this.roomPrice.current.validateFieldsAndScroll((err) => {
      if (err) this.setState({isLoading: false}, () => message.error('Lỗi dữ liệu nhập vào !'));
      else this.setState({isLoading: false, currentStep});
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
        }, () => message.error('Lỗi dữ liệu nhập vào !'));
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
        }, () => message.error('Lỗi dữ liệu nhập vào !'));
      } else this.setState({currentStep, isLoading: false});
    });
  };

  /**
   * Create one or list images items for roomImagesFields
   */
  defaultStateImages = () => {
    const {buildingFields, roomGroupFieldsV2, roomImagesFields} = this.state;
    let multipleData = {};

    /**
     * Checking building type id
     */
    if (buildingFields.typeId.value !== CONST.NHATRO) multipleData[0] = [];
    else Object.values(roomGroupFieldsV2).forEach(data => {
      multipleData[data.id.value] = [];
    });

    this.handleFormChange({
      ...roomImagesFields, multipleData,
    }, 'roomImagesFields');
  };

  checkEnoughImages = (currentStep) => {
    const {buildingFields, roomGroupFieldsV2, roomImagesFields} = this.state;
    if (buildingFields.typeId.value !== CONST.NHATRO) {
      if (roomImagesFields.multipleData[0].length < CONST.MIN_IMAGES_QUANTITY) this.setState({
        isLoading: false,
      }, () => notification.error({
        message: 'Không đủ số lượng ảnh tối thiểu',
        description: `Bạn cần tải lên tối thiểu ${CONST.MIN_IMAGES_QUANTITY} ảnh mô tả phòng cho thuê của bạn.`,
      }));
      else if (roomImagesFields.multipleData[0].length > CONST.MAX_IMAGES_QUANTITY) this.setState({
        isLoading: false,
      }, () => notification.error({
        message: 'Vượt quá số lượng ảnh cho phép',
        description: `Bạn chỉ được tải lên tối đa ${CONST.MAX_IMAGES_QUANTITY} ảnh mô tả phòng cho thuê của bạn.`,
      }));
      else this.setState({isLoading: false, currentStep});

    } else {
      let check = true;
      const roomGroupArr = Object.values(roomGroupFieldsV2);
      for (let i = 0; i < roomGroupArr.length; i++) {
        const imagesLength = roomImagesFields.multipleData[roomGroupArr[i].id.value].length;
        if (imagesLength < CONST.MIN_IMAGES_QUANTITY) {
          this.setState({isLoading: false}, () => {
            notification.error({
              message: `Loại phòng ${formatterCurrency(roomGroupArr[i].rentPrice.value)} VNĐ`,
              description: `Chưa đủ số tối thiểu ${CONST.MIN_IMAGES_QUANTITY} ảnh cho loại phòng trọ này.`,
            });
          });
          check = false;
          break;
        } else if (imagesLength > CONST.MAX_IMAGES_QUANTITY) {
          this.setState({isLoading: false}, () => {
            notification.error({
              message: `Loại phòng ${formatterCurrency(roomGroupArr[i].rentPrice.value)} VNĐ`,
              description: `Bạn chỉ được tải lên tối đa ${CONST.MAX_IMAGES_QUANTITY} ảnh mô tả phòng cho thuê của bạn.`,
            });
          });
          check = false;
          break;
        }
      }
      if (check) this.setState({isLoading: false, currentStep});
    }
  };

  completeForm = () => {
    const {buildingFields, buildingServicesFields} = this.state;
    const hide = message.loading('Đang tạo thông tin lên máy chủ...', 0);

    new API('building').create({
      typeId: buildingFields.typeId.value,
      buildingName: buildingFields.buildingName.value,
      floorQuantity: buildingFields.floorQuantity.value,
      province: JSON.stringify(buildingFields.province.value),
      district: JSON.stringify(buildingFields.district.value),
      ward: JSON.stringify(buildingFields.ward.value),
      detailedAddress: buildingFields.detailedAddress.value,
      addressDescription: draftToHtml(buildingFields.addressDescription.value),
      location: `${buildingFields.location.value.lat},${buildingFields.location.value.lng}`,
    }).then(dataResponse => {
      if (dataResponse && dataResponse.responseStatus === 200) {
        const buildingId = dataResponse.id;

        // start to create building services
        const formatData = Object.values(buildingServicesFields.data).filter(value => {
          const isNotNull = !!value.servicePrice || !!value.note;
          return buildingServicesFields['activeServices'].includes(String(value.serviceId)) && isNotNull;
        });

        new API('buildingService').createMultiple({
          buildingId,
          data: formatData,
        }).then(data => {
          if (data.responseStatus === 200)
            this.completeRoomGroupForm(buildingFields.typeId.value, buildingId).then(() => {
              new API(`createRoomES/${buildingId}`).create().then(() => {
                hide();
                message.success('Tạo thông tin phòng thành công !');
                router.push(`/host/management?typeId=${buildingFields.typeId.value}`);
              });
            });
        });
      }
    }).catch(error => {
      hide();
      console.log(error);
      message.error('Tạo thông tin địa chỉ phòng thất bại !');
    });
  };

  completeRoomGroupForm = async (buildingType, buildingId) => {
    if (buildingType === CONST.NHATRO) {
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
      // END
    } else {
      const {roomGroupFields, roomAmenitiesFields} = this.state;
      const formatData = convertForm(roomGroupFields), amenitiesData = roomAmenitiesFields.userSelect;
      const roomGroupResponse = await new API('roomGroup').create({
        buildingId, data: {
          ...formatData,
          description: draftToHtml(formatData.description)
        }
      });
      const roomGroupId = roomGroupResponse.dataResponse.roomGroupData.id;

      const amenitiesResponse = await new API('roomAmenities').create({roomGroupId, data: amenitiesData});
      const imagesResponse = await this.createMultipleRoomImages([roomGroupId]);
      return {roomGroupResponse, amenitiesResponse, imagesResponse};
      // END
    }
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
    const {buildingFields} = this.state;
    const currentStep = this.state.currentStep + 1;
    this.setState({isLoading: true});

    /**
     * Complete form create
     */
    if (currentStep === 8) this.completeForm();
    else if (buildingFields.typeId.value !== CONST.NHATRO) {
      // create default state for upload images component
      if (currentStep === 4) this.defaultStateImages();
      if (currentStep === 1) this.verifyAddress(currentStep);
      else if (currentStep === 3) this.verifyRoomGroup1(currentStep);
      else if (currentStep === 6) this.checkEnoughImages(currentStep);
      else if (currentStep === 7) this.verifyRoomGroup2(currentStep);
      else this.setState({isLoading: false, currentStep});
    } else {
      // create default state for upload images component
      if (currentStep === 5) this.defaultStateImages();
      if (currentStep === 1) this.verifyAddress(currentStep);
      else if (currentStep === 4) this.verifyMultipleRoomGroup1(currentStep);
      else if (currentStep === 5) this.verifyMultipleRoomGroup2(currentStep);
      else if (currentStep === 7) this.checkEnoughImages(currentStep);
      else this.setState({isLoading: false, currentStep});
    }
  };

  prev = () => {
    const {currentStep} = this.state;
    if (!currentStep) router.goBack();
    else this.setState({currentStep: currentStep - 1});
  };

  render() {
    const {isLoading, isDisableNext, currentStep} = this.state;
    const {buildingTypes, vnLocations, buildingServices, roomAmenities} = this.state;
    const {buildingFields, roomGroupFields, buildingServicesFields, roomAmenitiesFields, roomImagesFields} = this.state;
    const {countId, roomGroupFieldsV2, roomAmenitiesFieldsV2} = this.state;

    const steps = buildingFields.typeId.value !== CONST.NHATRO ? [
      {
        title: 'Tạo kiểu phòng cho thuê',
        content: <BuildingForm
          ref={this.buildingForm} {...vnLocations}
          {...buildingFields} buildingTypes={buildingTypes}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Kiểm tra địa chỉ',
        content: <CheckPinGoogleMap
          {...buildingFields} handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Thông tin chi tiết',
        content: <RoomInformation
          ref={this.roomInfo}
          {...roomGroupFields} handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Dịch vụ',
        content: <RoomServiceForm
          buildingServices={buildingServices}
          fields={buildingServicesFields} handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Tiện ích',
        content: <AmenitiesForm
          {...roomAmenitiesFields} amenities={roomAmenities}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Tải hình ảnh',
        content: <UploadFormV2
          buildingType={buildingFields.typeId.value}
          roomImagesFields={roomImagesFields}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Giá phòng',
        content: <RoomPrice
          ref={this.roomPrice}
          {...roomGroupFields}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Điều khoản sử dụng dịch vụ',
        content: <TermsAndPrivacy onChange={this.handleAcceptTermOfService}/>,
      },
    ] : [
      {
        title: 'Tạo kiểu phòng cho thuê',
        content: <BuildingForm
          ref={this.buildingForm} {...vnLocations}
          {...buildingFields} buildingTypes={buildingTypes}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Kiểm tra địa chỉ',
        content: <CheckPinGoogleMap
          {...buildingFields} handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Dịch vụ',
        content: <RoomServiceForm
          buildingServices={buildingServices}
          fields={buildingServicesFields} handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Các loại phòng',
        content: <InputTypePrice
          ref={this.inputTypePrice}
          countId={countId}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChange={this.handleFormChange}
          handleFormChangeV2={this.handleFormChangeV2}/>,
      },
      {
        title: 'Thông tin chi tiết các loại phòng',
        content: <RoomInformationV2
          ref={this.multipleRoomInfo}
          countId={countId}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChangeV2={this.handleFormChangeV2}/>,
      },
      {
        title: 'Tiện ích các loại phòng',
        content: <AmenitiesFormV2
          amenities={roomAmenities}
          handleFormChange={this.handleFormChange}
          roomGroupFieldsV2={roomGroupFieldsV2}
          roomAmenitiesFieldsV2={roomAmenitiesFieldsV2}/>,
      },
      {
        title: 'Tải hình ảnh',
        content: <UploadFormV2
          countId={countId}
          buildingType={buildingFields.typeId.value}
          roomImagesFields={roomImagesFields}
          roomGroupFieldsV2={roomGroupFieldsV2}
          handleFormChange={this.handleFormChange}/>,
      },
      {
        title: 'Điều khoản sử dụng dịch vụ',
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
              {`Bước ${currentStep + 1}: ${steps[currentStep].title}`}
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
                Quay lại
              </Button>
              <Button type='primary' size='large'
                      className={styles.nextBtn}
                      onClick={this.next} loading={isLoading}
                      disabled={currentStep === steps.length - 1 ? isDisableNext : false}>
                {currentStep === steps.length - 1 ? 'Hoàn tất' : 'Tiếp theo'}
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
