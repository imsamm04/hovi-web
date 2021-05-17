import React, {Component} from 'react';
import {Icon, Input, message, Spin} from 'antd';
import {withScriptjs} from 'react-google-maps';
import StandaloneSearchBox from 'react-google-maps/lib/components/places/StandaloneSearchBox';
import Geocode from 'react-geocode';
// import styles from './index.less';

// https://www.npmjs.com/package/react-geocode
Geocode.setApiKey(process.env.APIKey);
Geocode.enableDebug();

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: props.address,
      location: {
        lat: props.lat,
        lng: props.lng
      },
      isLoadingGetCurrentLocation: false,
    };
    this.searchBox = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {lat, lng, address} = nextProps;
    this.setState({address, location: {lat, lng}});
  }

  handleSearchChange = (e) => this.setState({address: e.target.value}, () => {
    if (!this.state.address)
      this.props.handleChangeOptionSearch('location', {
        location: {lat: '', lng: ''}
      });
  });

  handleChangeLocationSearch = ({address, location}) => this.setState({address, location}, () => {
    this.props.handleChangeOptionSearch('location', location); // location of optionsSearch
  });

  onPlacesChanged = () => {
    const places = this.searchBox.current.getPlaces();
    if (places[0]) {
      const address = places[0].formatted_address;
      const location = {
        address,
        lat: places[0].geometry.location.lat(),
        lng: places[0].geometry.location.lng(),
      };

      this.handleChangeLocationSearch({address, location});
    }
  };

  /**
   * Get current location of user
   */
  handleGetCurrentLocation = () => {
    this.setState({isLoadingGetCurrentLocation: true});
    const location = window.navigator && window.navigator.geolocation;
    if (location) {
      location.getCurrentPosition((position) => {
        new window.google.maps.Geocoder().geocode({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }, (results, status) => {
          if (status === 'OK' && results[0])
            this.handleChangeLocationSearch({
              address: results[0].formatted_address,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: results[0].formatted_address,
              }
            });
          else message.warning('Không tìm thấy địa chỉ hiện tại của bạn!');

          this.setState({isLoadingGetCurrentLocation: false}); // set loading to false when end of any case
        });
      }, (error) => {
        console.log(error);
        message.warning('Không thể truy cập vị trí hiện tại của bạn!');
        this.setState({isLoadingGetCurrentLocation: false});
      });
    }
  };


  render() {
    const {isLoadingGetCurrentLocation, address} = this.state;

    return (
      <div data-standalone-searchbox="">
        <StandaloneSearchBox ref={this.searchBox} bounds={this.props.bounds} onPlacesChanged={this.onPlacesChanged}>
          <Input.Search
            allowClear
            size='large'
            value={address}
            onChange={this.handleSearchChange}
            placeholder="Tìm kiếm"
            addonBefore={
              <Spin spinning={isLoadingGetCurrentLocation}>
                <Icon type='environment' theme='filled' onClick={this.handleGetCurrentLocation}/>
              </Spin>
            }/>
        </StandaloneSearchBox>
      </div>
    );
  }
}

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.APIKey}&v=3.exp&libraries=geometry,drawing,places`;

const GoogleMapComponent = withScriptjs(MapComponent);
export default ({...props}) => <GoogleMapComponent
  {...props}
  loadingElement={<div style={{height: '100%'}}/>}
  googleMapURL={googleMapURL}/>;
