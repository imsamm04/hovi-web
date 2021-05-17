import FirebaseApp from './FirebaseApp';
import * as CONST from './const';

FirebaseApp.auth().languageCode = 'en';
/**
 * Input(price): type: number => Output(price): type: String
 * Example: 10000 => 10,000
 * @param {*} price
 * return {number}
 */
const formatterCurrency = price => {
  if (!price) return price;
  return price.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
/**
 * Input(price): type: number => Output(price): type: String
 * Example: 10,000 => 10,000
 * @param {*} price
 * return {string}
 */
const parserCurrency = price => {
  if (!price) return price;
  return price.toString().replace(/,/g, '');
};

const defaultState = {
  price: [CONST.MIN_PRICE, CONST.MAX_PRICE],
  capacity: [CONST.MIN_CAPACITY, CONST.MAX_CAPACITY],
  area: [CONST.MIN_AREA, CONST.MAX_AREA],
  location: {lat: '', lng: '', address: '',},
  amenities: [],
  roomTypes: [],
  gender: 2,
  radius: 0.5,
  direction: '',
};

const getDefaultFilter = (fieldName) => {
  return defaultState[fieldName];
};

const checkCompareFilter = (value, type) => {
  return JSON.stringify(value) !== JSON.stringify(defaultState[type]);
};

const checkCompareAdvancedFilter = (value) => {
  const areaCheck = defaultState.area.filter((v, i) => v !== value.area[i]);
  const latCheck = value.location.lat && defaultState.location.lat !== value.location.lat;

  if (latCheck) return false;
  else if (defaultState.direction !== value.direction || value.direction === undefined) return false;
  else if (defaultState.gender !== value.gender) return false;
  else return !areaCheck.length;
};

const getLocationSearchFromUrl = data => {
  // get location
  let locationSearch = [];
  try {
    locationSearch = JSON.parse(data.location);
  } catch (e) {
    locationSearch = [];
  }

  return locationSearch;
};

const getOptionsSearchFromUrl = options => {
  // get location if type search is search around
  let location = {};
  const {lat, lng, address} = options;
  if (lat && lng && address) location = {lat, lng, address};

  // get direction
  let direction = '';
  if (CONST.DIRECTION.includes(options.direction)) direction = options.direction;

  // get price
  let price = getDefaultFilter('price');
  let priceRange = options['price'] && options['price'].split(',') || [];
  if (priceRange.length === 2) {
    let minPrice = Number(priceRange[0]), maxPrice = Number(priceRange[1]);
    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      let min, max;
      if (minPrice < CONST.MIN_PRICE) min = CONST.MIN_PRICE;
      else if (minPrice > CONST.MAX_PRICE) min = CONST.MAX_PRICE;
      else min = minPrice;

      if (maxPrice < CONST.MIN_PRICE) max = CONST.MIN_PRICE;
      else if (maxPrice > CONST.MAX_PRICE) max = CONST.MAX_PRICE;
      else max = maxPrice;

      price = [min, max];
    }
  }

  // get area
  let area = getDefaultFilter('area');
  let areaRange = options['area'] && options['area'].split(',') || [];
  if (areaRange.length === 2) {
    let minArea = Number(areaRange[0]), maxArea = Number(areaRange[1]);
    if (!isNaN(minArea) && !isNaN(maxArea)) {
      let min, max;
      if (minArea < CONST.MIN_AREA) min = CONST.MIN_AREA;
      else if (minArea > CONST.MAX_AREA) min = CONST.MAX_AREA;
      else min = minArea;

      if (maxArea < CONST.MIN_AREA) max = CONST.MIN_AREA;
      else if (maxArea > CONST.MAX_AREA) max = CONST.MAX_AREA;
      else max = maxArea;

      area = [min, max];
    }
  }

  // get capacity
  let capacity = getDefaultFilter('capacity');
  let capacityRange = options['capacity'] && options['capacity'].split(',') || [];
  if (capacityRange.length === 2) {
    let minCapacity = Number(capacityRange[0]), maxCapacity = Number(capacityRange[1]);
    if (!isNaN(minCapacity) && !isNaN(maxCapacity)) {
      let min, max;
      if (minCapacity < CONST.MIN_CAPACITY) min = CONST.MIN_CAPACITY;
      else if (minCapacity > CONST.MAX_CAPACITY) min = CONST.MAX_CAPACITY;
      else min = minCapacity;

      if (maxCapacity < CONST.MIN_CAPACITY) max = CONST.MIN_CAPACITY;
      else if (maxCapacity > CONST.MAX_CAPACITY) max = CONST.MAX_CAPACITY;
      else max = maxCapacity;

      capacity = [min, max];
    }
  }

  // get amenities
  let amenitiesArr = options['amenities']
    && String(options['amenities']).split(',')
    || getDefaultFilter('amenities');
  let amenities = amenitiesArr.filter(value => !isNaN(Number(value)));
  amenities = amenities.map(value => Number(value));

  // get roomTypes
  let roomTypesArr = options['types'] && options['types'].toString().split(',')
    || getDefaultFilter('roomTypes');
  let roomTypes = roomTypesArr.filter(value => !isNaN(Number(value)));
  roomTypes = roomTypes.map(value => Number(value));

  // get gender
  let gender = getDefaultFilter('gender');
  let genderNum = Number(options['gender']);
  if (!isNaN(genderNum) && genderNum < 3 && genderNum >= 0) gender = genderNum;

  // get radius
  let radius = getDefaultFilter('radius');
  let radiusNum = Number(options['radius']);
  if (!isNaN(radiusNum) && radiusNum >= 0.5) radius = radiusNum;

  return {
    ...defaultState,
    area,
    price,
    capacity,
    radius,
    gender,
    direction,
    location,
    amenities: amenities.filter(Number),
    roomTypes: roomTypes.filter(Number),
  };
};
/**
 * get partUrl
 * Input(price, amenities, roomTypes, gender)
 * output(price, amenities, roomTypes, gender)
 * Example:
 gender: '0'=> 0,
 amenities: '1,2,3,4,6,5'=>[1,2,3,4,6,5],
 price: '100000,200000'=>[100000,200000],
 types: '1,2,3'=>[1,2,3]
 * param location
 * param type
 */
const getPartUrl = (location, type = 'locations') => {
  if (type === 'locations') return getLocationSearchFromUrl(location);
  else return getOptionsSearchFromUrl(location);
};

/**
 * buildQuerySearch
 * Input(price, amenities, roomTypes, gender)
 * output(price, amenities, roomTypes, gender)
 * Example:
 address: [1,2,3]=> "Quan cau giay",
 amenities: [1,2,3,4,6,5]=>1,2,3,4,6,5,
 price: [100000,200000]=>100000,200000,
 types: '1,2,3'=>[1,2,3]
 lat 0 and lng 1 => location = 0,1

 * param  price, amenities, roomTypes, gender, address, lat, lng
 return output
 */
const buildQuerySearch = ({price, amenities, roomTypes, gender, capacity, location, radius, area, direction, page}) => {
  let output = {};

  if (Array.isArray(location) && location.length) output = {location: JSON.stringify(location)};
  else if (!!location.lat && !!location.lng && !!location.address) {
    output['address'] = location.address;
    output['lat'] = location.lat;
    output['lng'] = location.lng;
  }

  if (radius && checkCompareFilter(radius, 'radius')) output['radius'] = radius;
  if (direction) output['direction'] = direction;
  if (page) output['page'] = page;

  if (area && checkCompareFilter(area, 'area'))
    output['area'] = `${area[0]},${area[1]}`;

  if (capacity && checkCompareFilter(capacity, 'capacity'))
    output['capacity'] = `${capacity[0]},${capacity[1]}`;

  if (price && checkCompareFilter(price, 'price'))
    output['price'] = `${price[0]},${price[1]}`;

  if (checkCompareFilter(gender, 'gender'))
    output['gender'] = gender;

  if (amenities && amenities.length > 0)
    output['amenities'] = amenities.reduce((val, curr) => `${val},${curr}`);

  if (roomTypes && roomTypes.length > 0)
    output['types'] = roomTypes.reduce((val, curr) => `${val},${curr}`);

  return output;
};

/**
 * method returns the Unicode Normalization Form of a given string
 * Input(str)
 * output(str after Unicode Normalization)
 * Example:
 30 nguyễn duy thanh => 30 nguyen duy thanh
 * param str
 return output
 */
const removeUnicode = (str) => {
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};
/**
 * method filter for unique values or remove duplicate values
 * Input(str)
 * output(str after remove duplicate)
 * Example:
 quận cầu giấy hà hà nội => quận cầu giấy hà nội
 return output
 */
const removeDuplicate = (array) => {
  return array.filter((item, index) => {
    return array.indexOf(item) === index;
  });
};


/**
 * check if the input is a function or not
 * input (function)
 * @returns {boolean}
 */

const isFunction = (functionToCheck) => {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};


const getAddressObject = (address_components) => {
  let ShouldBeComponent = {
    home: ['street_number'],
    postal_code: ['postal_code'],
    street: ['street_address', 'route'],
    district: [
      'administrative_area_level_2',
      'administrative_area_level_3',
      'administrative_area_level_4',
      'administrative_area_level_5',
    ],
    city: ['administrative_area_level_1'],
    ward: [
      'locality',
      'sublocality',
      'sublocality_level_1',
      'sublocality_level_2',
      'sublocality_level_3',
      'sublocality_level_4',
    ],
    country: ['country'],
  };

  let address = {};

  address_components.forEach(component => {
    for (let shouldBe in ShouldBeComponent) {
      if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
        console.log(shouldBe);
        console.log(component.long_name);
        if (shouldBe === 'country') {
          address[shouldBe] = component.short_name;
        } else {
          address[shouldBe] = component.long_name;
        }
      }
    }
  });
  return address;
};

/**
 * Compare address from google map (after convert) is match current address (user input)
 * @param address_components
 * @param compareValue
 * @returns {boolean}
 */
const compareAddress = (address_components, compareValue) => {
  const {city, district} = getAddressObject(address_components);
  if (!city || !district) return true;

  const provinceFromGGMap = city && removeUnicode(city).toLowerCase();
  const districtFromGGMap = district && removeUnicode(district).toLowerCase();
  const compareProvince = removeUnicode(compareValue.province).toLowerCase();
  const compareDistrict = removeUnicode(compareValue.district).toLowerCase();

  if (provinceFromGGMap.includes(compareProvince)
    || provinceFromGGMap.includes(compareProvince.replace(' ', '')))
    return districtFromGGMap.includes(compareDistrict);
  else return false;
};

/**
 * Check input string (buildingTypeName) is match with 'khu nhà trọ'
 * returns {boolean}
 */
const checkBuildingType = (buildingTypeName) => buildingTypeName === 'Khu nhà trọ';


const formatForm = (dataObj) => {
  let output = {};
  for (let [key, value] of Object.entries(dataObj)) {
    output[key] = {value}
  }
  return output;
};

const convertForm = (dataObj) => {
  let output = {};
  for (let [key, value] of Object.entries(dataObj)) {
    output[key] = value.value;
  }

  return output;
};

const formatLocation = (locationStr) => {
  const location = locationStr.split(',');
  return {
    lat: Number(location[0]),
    lng: Number(location[1]),
  };
};

const getDuplicate = names => {
  let uniq = names
    .map((name) => {
      return {
        count: 1,
        name: String(name).toLowerCase(),
      };
    })
    .reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count;
      return a;
    }, {});

  return Object.keys(uniq).filter((a) => uniq[a] > 1);
};

const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object;
};

const getGender = (genderCode) => {
  return CONST.GENDER_DEFINE.find(gender => gender.code === genderCode);
};

const normalizePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return phoneNumber;
  return 0 + phoneNumber.substring(3, phoneNumber.length);
};

const timestampToDateTime = (timestamp) => {
  let dataConvert = new Date(timestamp);

  let minutes = "0" + dataConvert.getMinutes(),
    hours = dataConvert.getHours(),
    date = dataConvert.getDate(),
    month = dataConvert.getMonth() + 1,
    year = dataConvert.getFullYear();

  return `${hours}:${minutes.substr(-2)} ${date}/${month}/${year}`;
};
const timestampToDate = (timestamp) => {
  let dataConvert = new Date(timestamp);

  let
    date = dataConvert.getDate(),
    month = dataConvert.getMonth() + 1,
    year = dataConvert.getFullYear();

  return `${date}/${month}/${year}`;
};

function timeDifference(previous) {
  const current = new Date().getTime();

  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerDay) {
    return {isNew: true, content: 'Mới nhất'};
  } else if (elapsed < msPerMonth) {
    return {
      isNew: false,
      content: Math.round(elapsed / msPerDay) + ' ngày trước'
    }
  } else if (elapsed < msPerYear) {
    return {
      isNew: false,
      content: Math.round(elapsed / msPerMonth) + ' tháng trước'
    }
  } else {
    return {
      isNew: false,
      content: Math.round(elapsed / msPerYear) + ' năm trước'
    }
  }
}

export {
  defaultState,
  FirebaseApp,
  CONST,
  formatterCurrency,
  parserCurrency,
  getDefaultFilter,
  checkCompareFilter,
  getPartUrl,
  buildQuerySearch,
  removeUnicode,
  removeDuplicate,
  isFunction,
  getAddressObject,
  compareAddress,
  checkBuildingType,
  formatForm,
  convertForm,
  formatLocation,
  getDuplicate,
  isObject,
  getGender,
  checkCompareAdvancedFilter,
  normalizePhoneNumber,
  timestampToDateTime,
  timeDifference,
  timestampToDate
};
