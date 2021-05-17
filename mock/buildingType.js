export default {
  'GET /api/building-type': (req, res) => {
    res.status(200).send([
      {
        id: 1,
        name: 'Chung cư',
      }, {
        id: 2,
        name: 'Nguyên căn',
      }, {
        id: 3,
        name: 'Phòng trọ',
      },
    ]);
  },
};
