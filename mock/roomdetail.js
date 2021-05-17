export default {
  '/api/roomdetail': {
    'images': [
      'https://a0.muscache.com/im/pictures/cd17b75f-9aee-4f68-b80d-dde84996fb4b.jpg?aki_policy=xx_large',
      'https://a0.muscache.com/im/pictures/a81576e4-8900-4232-90ff-425e02df5939.jpg?aki_policy=xx_large',
      'https://a0.muscache.com/im/pictures/64728570-5673-4d6f-9a45-a332db33069e.jpg?aki_policy=xx_large',
      'https://a0.muscache.com/im/pictures/a7f1daa1-911e-43e7-ac3b-7089ad8e470a.jpg?aki_policy=xx_large'
    ],
    'title': 'Khu trọ những người độc thân vui vẻ - 158 Cầu Giấy Hà Nội',
    'generalAddress': {
      'province': 'HN',
      'district': 'Ba Đình',
      'ward': 'Nguyễn Thái Học'

    },
    'status': 'Còn phòng',
    'area': 30,
    'capacity': 2,
    'gender': 'Nam',
    'amenities': [{amenities_id: 1, amenities_name: 'Không chung chủ'}, {
      amenities_id: 2,
      amenities_name: 'Chung WC'
    }, {amenities_id: 3, amenities_name: 'Ban công'}, {amenities_id: 4, amenities_name: 'Thang máy'}
      , {amenities_id: 5, amenities_name: 'Nuôi thú cưng'}, {amenities_id: 6, amenities_name: 'Nấu ăn'}, {
        amenities_id: 7,
        amenities_name: 'Điều hòa'
      }, {amenities_id: 8, amenities_name: 'Bình nóng lạnh'},
      {amenities_id: 9, amenities_name: 'Giường'}, {amenities_id: 10, amenities_name: 'Tủ'}, {
        amenities_id: 11,
        amenities_name: 'Bàn ghế'
      }],
    'services': [{id: 1, service_name: 'Gửi xe', service_price: 50000}, {
      id: 2,
      service_name: 'Bảo vệ',
      service_price: 50000
    },
      {id: 3, service_name: 'Vệ sinh', service_price: 20000}, {id: 4, service_name: 'Giặt đồ', service_price: 100000},
      {id: 5, service_name: 'Wifi', service_price: 80000}],
    'description': '- Căn hộ vừa được sửa mới, đẹp, thoáng mát. Dọn vệ sinh miễn phí 1 lần/tuần\n' +
      '- Giá thuê đã bao gồm nước sinh hoạt, 2 chỗ để xe, internet, và dọn vệ sinh phòng 1 lần/ tuần. Tiền điện 4000đ/kWh, có đồng hồ điện riêng\n' +
      '- 10ph đến đường Trần Hưng Đạo Q1, Đại học Sư Phạm\n' +
      '- Khu vực xung quanh có nhiều tiện ích: siêu thị mini, chợ, quán ăn... Bước chân ra khỏi nhà là dịch vụ và đồ ăn tận cửa',
    'roomCost': {
      'price': 2000000,
      'deposit': 1500000,

    },
    'phone': '0122834567',


  },
  '/api/getAvailableRoom': {
    availableRooms: [
      {
        roomId: 4,
        roomName: "201"
      },
      {
        roomId: 6,
        roomName: "301"
      }
    ]
  },
  // '/api/getAvailableRoom':{
  //   availableRooms: [
  //
  //   ]
  // }

}
