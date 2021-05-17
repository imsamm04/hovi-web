import React, {Component, Fragment} from 'react';
import {Circle, GoogleMap, Marker, withGoogleMap, withScriptjs} from 'react-google-maps';
import HomeIcon from '../../../assets/icons/icons8-home.svg';
import {CONST} from 'utils';

class MapComponent extends Component {
  render() {
    const {location} = this.props;
    return (
      <GoogleMap
        defaultZoom={17}
        center={location}
        options={{...CONST.MAP_STYLES, minZoom: 15, maxZoom: 17}}>
        <Fragment>
          <Marker
            icon={{
              url: HomeIcon,
              anchor: new window.google.maps.Point(27,32),
            }}
            position={location} draggable={false}>
            <Circle
              center={location}
              radius={150}
              options={{
                fillColor: 'rgb(24,144,255,0.5)',
                strokeColor: 'rgba(24,144,255, 0)',
              }}/>
          </Marker>
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
    height: '400px',
  },
};

const GoogleMapComponent = withScriptjs(withGoogleMap(MapComponent));
export default ({...props}) => <GoogleMapComponent
  {...props}
  mapElement={<div style={css.element}>ddd</div>}
  loadingElement={<div style={css.element}/>}
  containerElement={<div style={css.containerElement}/>}
  googleMapURL={googleMapURL}/>;
