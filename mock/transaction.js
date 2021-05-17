export default {
  '/api/transaction-for-host': [
    {
      transaction_id: '12345',
      user_id: 12321,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 12,
      status: 1,
      room_name: '201',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 5,
      status: 1,
      room_name: '600',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 4,
      status: 1,
      room_name: '601',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 20,
      status: 1,
      room_name: '505',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 19,
      status: 1,
      room_name: '504',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 1,
      status: 2,
      room_name: '301',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 2,
      status: 1,
      room_name: '303',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '14533',
      user_id: 121,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 3,
      status: 1,
      room_name: '302',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '12321',
      user_id: 1331,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 14,
      status: 3,
      room_name: '401',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '21321',
      user_id: 1221,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 15,
      status: 3,
      room_name: '501',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '12045',
      user_id: 12330,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 16,
      status: 3,
      room_name: '202',
      time_created: '2019/10/20'
    },
    {
      transaction_id: '12145',
      user_id: 12321,
      building_name: 'Khu trọ ABC - XYZ',
      room_id: 17,
      status: 3,
      room_name: '205',
      time_created: '2019/10/20'
    },

  ],
  '/api/transaction-for-user':
    [{
      transaction_id: '12313',
      post_id: 6,
      post_title: 'Khu trọ ABC - XYZ',
      room_id: 30,
      room_name: '201',
      status: 1,
      time_created: '2019/11/20'
    }],
  '/api/transaction': {
    transactionData: {
      date: '20/12/2019',
      transactionId: 1234,
      chosenRooms: [
        {
          roomId: 4,
          roomName: '201'
        }
      ]
    }
  },
  '/api/genBankContent': {
    content: 'DATCOC-3',
    moneyAmount: 5000000,
    bankList: [
      {
        accountNumber: '123456789',
        accountName: 'Pham Van Hoang',
        bankName: 'TPBank',

      },
      {
        accountNumber: '987654321',
        accountName: 'Pham Vu Hoang',
        bankName: 'VietComBank',
      }
    ],
  }
}
