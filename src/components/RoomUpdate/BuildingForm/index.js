import React, {Component} from 'react';
import CustomForm from './CustomForm';
import {formatLocation, formatForm, compareAddress} from 'utils';
import LocalStorage from 'utils/LocalStorage';
import Geocode from 'react-geocode';
import debounce from 'lodash/debounce';
import {message, Modal} from "antd";
import {API} from 'services';

Geocode.setApiKey(process.env.APIKey);
Geocode.setLanguage('vi');
Geocode.setRegion('vi');

const buildingFields = {
  typeId: {value: ''},
  buildingName: {value: ''},
  floorQuantity: {value: 1},
  province: {value: ''},
  district: {value: ''},
  ward: {value: ''},
  detailedAddress: {value: ''},
  addressDescription: {value: ''},
  location: {value: {}},
};

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isFindAddressLoading: false,
      buildingFields: this.formatBuildingForm(props.building),
      vnLocations: {}
    };

    this.verifyAddress = debounce(this.verifyAddress, 1000);
    this.buildingForm = React.createRef();
  }

  formatBuildingForm = (building) => {
    if (building) {
      const province = building ? JSON.parse(building.province) : '';
      const district = building ? JSON.parse(building.district) : '';
      const ward = building ? JSON.parse(building.ward) : '';
      const location = building ? formatLocation(building.location) : {};
      return {
        ...formatForm({
          ...building,
          location,
          province,
          district,
          ward
        })
      }
    } else return buildingFields;
  };

  getDataLocation = (building) => {
    const {province, district} = building;
    if (!province.value || !province.value) return;
    LocalStorage.getDistrictById(province.value[1])
      .then(districts => {
        LocalStorage.getWardById(district.value[1])
          .then(wards => this.setState(({vnLocations}) =>
            ({
              isLoading: false,
              vnLocations: {
                ...vnLocations,
                districts,
                wards
              }
            })));
      });
  };

  componentWillReceiveProps(nextProps, nextContext) {
    const buildingFields = this.formatBuildingForm(nextProps.building);
    this.setState({buildingFields}, () => {
      this.getDataLocation(buildingFields);
    });
  }

  componentDidMount() {
    this.getDataLocation(this.state.buildingFields);
    LocalStorage.getLocationProvinces()
      .then(provinces => this.setState(({vnLocations}) =>
        ({vnLocations: {...vnLocations, provinces}})));
  }

  handleFormChange = (changedFields, nameFields) => {
    const {province, district, ward, detailedAddress} = this.state.buildingFields;

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
            detailedAddress: {value: ''},
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
            detailedAddress: {value: ''},
          },
        })));
    }
    /**
     * If ward changed, reset detailedAddress
     */
    else if (changedFields.ward && changedFields.ward.value[1] !== ward.value[1]) {
      this.setState({
        [nameFields]: {
          ...this.state[nameFields],
          ...changedFields,
          detailedAddress: {value: ''},
        },
      })
    }
    /**
     * Verify address
     */
    else if (changedFields.detailedAddress && changedFields.detailedAddress.value !== detailedAddress.value) {
      if (changedFields.detailedAddress.value) {
        this.setState({
          [nameFields]: {...this.state[nameFields], ...changedFields},
        }, () => {
          this.verifyAddress(changedFields.detailedAddress);
        });
      }
    }
    /**
     * Default change state
     * Allow change item of state
     */
    else this.setState({
        [nameFields]: {...this.state[nameFields], ...changedFields},
      });
  };

  verifyAddress = (detailedAddress) => {
    this.setState({isFindAddressLoading: true,});
    const {province, district} = this.state.buildingFields;
    const findAddress = `${detailedAddress.value}, ${province.value[0]}, ${district.value[0]}`;
    Geocode.fromAddress(findAddress).then(response => {
        const {lat, lng} = response.results[0].geometry.location;
        /**
         * Checking address get from Google Map is matching province, district, ward
         */
        if (!compareAddress(response.results[0].address_components, {
          province: province.value[0],
          district: district.value[0]
        })) Modal.warning({
          title: 'Địa chỉ tìm kiếm không trùng khớp',
          content: 'Thông tin địa chỉ chi tiết không trùng khớp với các trường bạn đã nhập ở trên.',
          okText: 'Tôi đã hiểu'
        });

        this.setState(({buildingFields}) => ({
          isFindAddressLoading: false,
          buildingFields: {...buildingFields, location: {value: {lat, lng}}},
        }));
      }, () => this.setState(({buildingFields}) => ({
        isFindAddressLoading: false,
        buildingFields: {
          ...buildingFields,
          detailedAddress: {
            ...buildingFields.detailedAddress,
            errors: [new Error('Chúng tôi không thể xác thực địa chỉ của bạn. Kiểm tra kỹ địa chỉ chi tiết của bạn và thử lại.')],
          },
        },
      })),
    );
  };

  handleSubmit = () => {
    this.buildingForm.current.validateFields((err, values) => {
      if (err) this.setState({isLoading: false}, () => message.error('Lỗi dữ liệu nhập vào !'));
      else {
        const {building} = this.props;
        const {location} = this.state.buildingFields;
        new API('building').update({
          id: building.id, data: {
            ...values,
            location: `${location.value.lat},${location.value.lng}`,
            province: JSON.stringify(values.province),
            district: JSON.stringify(values.district),
            ward: JSON.stringify(values.ward),
          }
        }).then(() => {
          this.props.onClose();
          message.success('Cập nhật thành công');
        }).catch(err => {
          console.log(err);
        })
      }
    });
  };

  render() {
    const {buildingFields, vnLocations, isFindAddressLoading, isLoading} = this.state;
    return (
      <div>
        {!isLoading && <CustomForm
          ref={this.buildingForm}
          {...vnLocations}
          {...buildingFields}
          isFindAddressLoading={isFindAddressLoading}
          handleFormChange={this.handleFormChange}/>}
      </div>
    )
  }
}
