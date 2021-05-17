export default {
  '/api/users': {
    "id": 1,
    "username": "admin",
    "fullName": "Nguyen Nhu Thuong",
    "phoneNumber": "0986352227",
    "email": "thuongnnse05095@fpt.edu.vn",
    "address": "Ha Long Quang Ninh",
    "imageUrl": "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
  },
  'POST /api/users/create': (req, res) => {
    res.end('OK');
  },
  '/api/users/1': {id: 1},


};
