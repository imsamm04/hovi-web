import {API, ES} from 'services';
import FirebaseApp from './FirebaseApp';

export default class LocalStorage {

  static getCurrentUser = () => {
    return new Promise((resolve, reject) => {
      const unsubscribe = FirebaseApp.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });
  };

  static getAccessToken = () => {
    const {currentUser} = FirebaseApp.auth();
    return currentUser ? currentUser.getIdToken() : null;
  };

  static getRoomTypes = async () => {
    try {
      const output = localStorage.getItem('roomTypes');
      if (!output && output !== 'undefined') {
        const data = await new API('buildingType').getAll();
        localStorage.setItem('roomTypes', JSON.stringify(data));
        return data;
      } else return output ? JSON.parse(output) : [];
    } catch (e) {
      return [];
    }
  };

  static findRoomType = (typeId) => {
    const data = localStorage.getItem('roomTypes');
    const roomTypes = data ? JSON.parse(data) : [];
    const roomType = roomTypes.find(type => type.id === typeId);
    return roomType ? roomType.type : '';
  };

  static getRoomAmenities = async () => {
    try {
      const output = localStorage.getItem('roomAmenities');
      if (!output && output !== 'undefined') {
        const data = await new API('amenities').getAll();
        localStorage.setItem('roomAmenities', JSON.stringify(data));
        return data;
      } else return output ? JSON.parse(output) : [];
    } catch (e) {
      return [];
    }
  };

  static findRoomAmenities = (amenitiesId) => {
    const output = localStorage.getItem('roomAmenities');
    if (!output && output !== 'undefined') return;

    const roomAmenities = JSON.parse(output);
    return roomAmenities.find(amenities => amenities.id === amenitiesId);
  };

  static getBuildingServices = async () => {
    try {
      const output = localStorage.getItem('buildingServices');
      if (!output && output !== 'undefined') {
        const data = await new API('service').getAll();
        localStorage.setItem('buildingServices', JSON.stringify(data));
        return data;
      } else return output ? JSON.parse(output) : [];
    } catch (e) {
      return [];
    }
  };

  static findBuildingService = (buildingServiceId) => {
    const output = localStorage.getItem('buildingServices');
    if (!output && output !== 'undefined') return;

    const buildingServices = JSON.parse(output);
    return buildingServices.find(buildingService => buildingService.id === buildingServiceId);
  };

  static getLocationProvinces = async () => {
    try {
      const output = localStorage.getItem('provinces');
      if (!output && output !== 'undefined') {
        const data = await new ES('locations/provinces').getAll();
        localStorage.setItem('provinces', JSON.stringify(data));
        return data;
      } else return output ? JSON.parse(output) : [];
    } catch (e) {
      return [];
    }
  };

  static getDistrictById = async (id) => {
    try {
      let output = localStorage.getItem('districts');
      if (!output && output !== 'undefined') {
        const data = await new ES('locations/districts').getAll();
        output = JSON.stringify(data);
        localStorage.setItem('districts', output);
      }
      return output ? JSON.parse(output).filter(value => value.provinceId === id) : [];
    } catch (e) {
      return [];
    }
  };

  static findDistrictById = async (id) => {
    try {
      let output = localStorage.getItem('districts');
      if (!output && output !== 'undefined') {
        const data = await new ES('locations/districts').getAll();
        output = JSON.stringify(data);
        localStorage.setItem('districts', output);
      }
      output = output && JSON.parse(output).find(value => value.id === id) || {};
      const provinces = await LocalStorage.getLocationProvinces();
      const province = provinces.find(v => v.id === output.provinceId);
      return {
        ...output,
        province
      }
    } catch (e) {
      return [];
    }
  };

  static getWardById = async (id) => {
    return await new ES('locations/wards').getById(id);
  };

  static recentlySearch = (location, type = 1) => {
    if (type === 1 && location.length === 0) return;
    else if (type === 2 && (!location.address || !location.lat || !location.lng)) return;

    let add = {data: location};
    if (type === 1) {
      const name = location.map(val => val[0]).reverse().join(', ');
      add = {...add, name}
    } else if (type === 2) {
      add = {...add, name: location.address}
    }

    let dataArr = [];
    try {
      const data = localStorage.getItem('recentlySearch');
      if (data) dataArr = JSON.parse(data);
    } catch (e) {
      console.log(e.message);
    }

    dataArr = dataArr.filter(value => JSON.stringify(value) !== JSON.stringify(add));
    dataArr.unshift(add);
    if (dataArr.length > 4) dataArr.pop();

    localStorage.setItem('recentlySearch', JSON.stringify(dataArr));
  };

  static getRecentlySearch = () => {
    try {
      const data = localStorage.getItem('recentlySearch');
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  };
}
