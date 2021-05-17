import React, {Component, Fragment} from 'react';
import {Circle, GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';
import {CONST} from 'utils';

class MapComponent extends Component {
  render() {
    const {location, handleFormChange} = this.props;
    return (
      <GoogleMap
        defaultZoom={18}
        center={location.value}
        options={{...CONST.MAP_STYLES}}>
        <Fragment>
          <Marker
            position={location.value} draggable={true}
            onDragEnd={e => handleFormChange({
              location: {
                value: {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                },
              },
            }, 'buildingFields')}>
          </Marker>
          <Circle
            center={location.value}
            radius={50}
            options={{
              fillColor: 'rgb(24,144,255,0.5)',
              strokeColor: 'rgba(24,144,255, 0.8)',
            }}
          />
        </Fragment>
      </GoogleMap>
    );
  }
}

const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.APIKey}&v=3.exp&libraries=geometry,drawing,places`;
const css = {
  element: {height: '100%'},
  containerElement: {
    position: 'relative',
    width: '100%',
    height: '310px',
  },
};

const GoogleMapComponent = withScriptjs(withGoogleMap(MapComponent));
export default ({...props}) => <GoogleMapComponent
  {...props}
  mapElement={<div style={css.element}/>}
  loadingElement={<div style={css.element}/>}
  containerElement={<div style={css.containerElement}/>}
  googleMapURL={googleMapURL}/>;
