export const NHATRO = 3;
export const GENDER_DEFINE = [{code: 0, name: 'Nữ'}, {code: 1, name: 'Nam'}, {code: 2, name: 'Cả hai'}];
export const MIN_PRICE = 0;
export const MAX_PRICE = 100000000;
export const MIN_SERVICE_PRICE = 0;
export const MAX_SERVICE_PRICE = 5000000;
export const MIN_CAPACITY = 1;
export const MAX_CAPACITY = 20;
export const MIN_AREA = 10;
export const MAX_AREA = 1000;
export const MIN_DEPOSIT_PERIOD = 1;
export const MAX_DEPOSIT_PERIOD = 12;
export const MIN_IMAGES_QUANTITY = 4;
export const MAX_IMAGES_QUANTITY = 8;
export const MIN_QUANTITY_FLOOR = 1;
export const MAX_QUANTITY_FLOOR = 100;
export const MAX_ROOMS_IN_ROOM_GROUP = 20;
export const STEP = 100000;
export const VERIFY_VIEW_CODE = 1;
export const REGISTER_VIEW_CODE = 2;
export const LOGIN_VIEW_CODE = 3;
export const FORGOT_PASSWORD_VIEW_CODE = 4;
export const RESET_PASSWORD_VIEW_CODE = 5;
export const DIRECTION = ['Bắc', 'Nam', 'Đông', 'Tây', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam'];

// update room information
export const AMENITIES_DRAWER = 1;
export const SERVICES_DRAWER = 2;
export const BUILDING_DRAWER = 3;
export const ROOM_GROUP_DRAWER = 4;
export const IMAGES_DRAWER = 5;
export const ROOM_NAME_DRAWER = 6;

export const MAP_STYLES = {
  scrollwheel: false,
  navigationControl: false,
  mapTypeControl: false,
  scaleControl: false,
  fullscreenControl: false,
  styles: [
    {
      'featureType': 'administrative',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#d6e2e6',
        },
      ],
    },
    {
      'featureType': 'administrative',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#cfd4d5',
        },
      ],
    },
    {
      'featureType': 'administrative',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#7492a8',
        },
      ],
    },
    {
      'featureType': 'administrative.neighborhood',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'lightness': 25,
        },
      ],
    },
    {
      'featureType': 'landscape.man_made',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#dde2e3',
        },
      ],
    },
    {
      'featureType': 'landscape.man_made',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#cfd4d5',
        },
      ],
    },
    {
      'featureType': 'landscape.natural',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#dde2e3',
        },
      ],
    },
    {
      'featureType': 'landscape.natural',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#7492a8',
        },
      ],
    },
    {
      'featureType': 'landscape.natural.terrain',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#dde2e3',
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'saturation': -100,
        },
      ],
    },
    {
      'featureType': 'poi',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#588ca4',
        },
      ],
    },
    {
      'featureType': 'poi.business',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#a9de83',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#bae6a1',
        },
      ],
    },
    {
      'featureType': 'poi.park',
      'elementType': 'labels.text',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'poi.sports_complex',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#c6e8b3',
        },
      ],
    },
    {
      'featureType': 'poi.sports_complex',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#bae6a1',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'saturation': -45,
        },
        {
          'lightness': 10,
        },
        {
          'visibility': 'on',
        },
      ],
    },
    {
      'featureType': 'road',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#41626b',
        },
      ],
    },
    {
      'featureType': 'road.arterial',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#ffffff',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#c1d1d6',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [
        {
          'color': '#a6b5bb',
        },
      ],
    },
    {
      'featureType': 'road.highway',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'visibility': 'on',
        },
      ],
    },
    {
      'featureType': 'road.highway.controlled_access',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#9fb6bd',
        },
      ],
    },
    {
      'featureType': 'road.local',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#ffffff',
        },
      ],
    },
    {
      'featureType': 'transit',
      'elementType': 'labels.icon',
      'stylers': [
        {
          'saturation': -70,
        },
      ],
    },
    {
      'featureType': 'transit.line',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#b4cbd4',
        },
      ],
    },
    {
      'featureType': 'transit.line',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#588ca4',
        },
      ],
    },
    {
      'featureType': 'transit.station',
      'stylers': [
        {
          'visibility': 'off',
        },
      ],
    },
    {
      'featureType': 'transit.station',
      'elementType': 'labels.text.fill',
      'stylers': [
        {
          'color': '#008cb5',
        },
        {
          'visibility': 'on',
        },
      ],
    },
    {
      'featureType': 'transit.station.airport',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'saturation': -100,
        },
        {
          'lightness': -5,
        },
      ],
    },
    {
      'featureType': 'water',
      'elementType': 'geometry.fill',
      'stylers': [
        {
          'color': '#a6cbe3',
        },
      ],
    },
  ],
};
export const TransactionStatus = {
  //DEFINE TRANSACTION STATUS
    DUMMY_STATUS: 0,
    ACCEPT_WAITING: 1,
    HOST_REJECTED : -1,
    NOT_ENOUGH_BALANCE : -2,
    ENOUGH_BALANCE : 2,
    EXPIRE_FAILED : -3,
    HOST_DEPOSIT_TRANSFERRED : 3,
    CHECKED_OUT : 4,

};

export const ManagementRoomStatus=[{code:0,name:'Chưa có khách thuê',color:'red'},
  {code:-1,name:'Chưa có khách thuê',color:'red'},
  {code:1,name:'Khách đang yêu cầu thuê phòng',color:'blue'},
  {code:-2,name:'Đang đợi khách đặt cọc',color:'blue'},
  {code:2,name:'Đang đợi khách nhận phòng',color:'cyan'},
  {code:3,name:'Khách đang thuê phòng',color:'green'}]

export const MyContactRoomStatus=[{code:0,name:'Chưa gửi yêu cầu đặt cọc',color:'red'},
  {code:-1,name:'Chưa gửi yêu cầu đặt cọc',color:'red'},
  {code:1,name:'Đang đợi chủ nhà phản hồi',color:'blue'},
  {code:-2,name:'Chủ nhà đồng ý cho thuê',color:'blue'},
  {code:2,name:'Đã đặt cọc',color:'cyan'},
  {code:3,name:'Đang thuê phòng',color:'green'}]

export const GENDER_DISPLAY = [{code: 0, name: 'Nữ'}, {code: 1, name: 'Nam'}, {code: 2, name: 'người'}];
export const BUILDING_TYPE_ID = [{code: 1, name: 'Chung cư'}, {code: 2, name: 'Nhà nguyên căn'}, {
  code: 3,
  name: 'Khu trọ'
}];
export const REVIEW_ROOM_STATUS = {
  CREATE:0,
  UPDATE:1
}
