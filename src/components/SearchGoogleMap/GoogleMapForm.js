import React, {Component, Fragment} from 'react';
import {Spin} from 'antd';
import {GoogleMap, InfoWindow, withGoogleMap, withScriptjs} from 'react-google-maps';
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import ItemMarker from './ItemMarker';
import styles from './GoogleMapForm.less';
import {CONST, formatterCurrency} from 'utils';
import classNames from 'classnames';

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      infoIndex: null,
      isLoading: props.isLoading,
      isHover: props.isHover,
      markers: props.currentMarker,
      mapPosition: props.mapPosition,
    };
    this.searchBox = React.createRef();
    this.ggMap = React.createRef();
  }

  componentDidMount() {
    this.onFitBounds(this.props.currentMarker);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.isHover) this.setState({isHover: nextProps.isHover,});
    this.onFitBounds(nextProps.currentMarker);
    this.setState({
      isLoading: nextProps.isLoading,
      markers: nextProps.currentMarker,
      mapPosition: nextProps.mapPosition,
    })
  }

  onFitBounds = (markers) => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.map(item => {
      bounds.extend(item.position);
      return item.id
    });
    this.ggMap.current.fitBounds(bounds);
  };

  showInfo = (index) => this.setState(({isOpen, infoIndex}) => ({
    isOpen: infoIndex !== index || !isOpen,
    infoIndex: index
  }));

  render() {
    const {isHover, markers, isOpen, infoIndex} = this.state;
    const {results} = this.props;

    return (
      <GoogleMap
        ref={this.ggMap}
        defaultZoom={13}
        options={{...CONST.MAP_STYLES, maxZoom: 17}}>
        {markers.map((marker, index) => {
          return (
            <Fragment key={index}>
              <MarkerWithLabel
                icon={{url: ''}}
                position={marker.position}
                labelAnchor={new window.google.maps.Point(60, 31)}
                onClick={() => this.showInfo(index)}
                labelClass={classNames(styles.labels, {
                  [styles.isLabelHover]: isHover === marker.id
                })}>
                <div>
                  <div className={classNames(styles.arrow, {
                    [styles.isHoverArrow]: isHover === marker.id,
                    [styles.hide]: isOpen && infoIndex === index
                  })}/>
                  <div className={classNames(styles.inner, {
                    [styles.isHover]: isHover === marker.id,
                    [styles.hide]: isOpen && infoIndex === index
                  })}>
                    {formatterCurrency(marker.rentPrice)} VNĐ
                  </div>
                  {(isOpen && infoIndex === index) &&
                  <InfoWindow
                    position={marker.position}
                    onCloseClick={this.showInfo}>
                    <ItemMarker item={results[index]}/>
                  </InfoWindow>}
                </div>
              </MarkerWithLabel>
            </Fragment>
          )
        })}
      </GoogleMap>
    );
  }
}

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.APIKey}&v=3.exp&libraries=geometry,drawing,places`;

const GoogleMapComponent = withScriptjs(withGoogleMap(MapComponent));
export default ({...props}) => <GoogleMapComponent
  {...props}
  mapElement={<div className={styles.mapElement}/>}
  loadingElement={<Spin className={styles.spinGGMap} spinning={true}/>}
  containerElement={<div className={styles.ggMap}/>}
  googleMapURL={googleMapURL}/>;
