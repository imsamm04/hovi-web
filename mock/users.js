export default {
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'Serati123@gmail.com',
    level: '###',
    phone: '0386666428',
    countReviews: '120 reviews',

    reviews: {
      comment: [
        {
          id: 1,
          content: 'The flat is small, difficult to fit two people in it but you,Amazing location for centre of Paris, is cosy for a couple, fine if you know each other well.',
          updatedAt: new Date(),
          memberLink: '',
          name: 'sam',
          avatar: 'https://cdn.vox-cdn.com/thumbor/HwKACOw9WvbC8ebYd_odmfu8-H0=/0x0:1363x732/920x613/filters:focal(573x257:791x475):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65404950/Screen_Shot_2019_08_28_at_12.06.58_PM.0.png'
        },
        {
          id: 2,
          content: 'Nancys Apartment was very good located, we loved to access a lot of famous places by foot. Supermarket was also nearby. The apartment is smaller than expected but still well designed. When we arrived, it was not as clean as expected, we found dirt everywhere and the kitchen missed a few basic ingredients like oil or sugar. Overall it was a well located small apartment good for a weekend, if it was clean.',
          updatedAt: new Date(),
          memberLink: '',
          name: 'lucy',
          avatar: 'https://cdn.24h.com.vn/upload/1-2019/images/2019-03-20/Check-in-lien-tay-co-ngay-anh-dep-tai-canh-dong-hoa-thi-la-1-1553079435-562-width650height690.jpg'
        },
        {
          id: 3,
          content: 'This place is in a very central location, easy to access all of the shops and restaurants on the Champs Elysees. That being said, the area felt comparable to Times Square/5th Avenue in New York City. So if you’re looking for something less touristy, this may not be for you. The apartment is quite small, good for one person but maybe not more.',
          updatedAt: new Date(),
          memberLink: '',
          name: 'linh tran',
          avatar: 'https://cdn.24h.com.vn/upload/1-2019/images/2019-03-20/Check-in-lien-tay-co-ngay-anh-dep-tai-canh-dong-hoa-thi-la-2-1553079435-336-width650height812.jpg'
        },
        {
          id: 4,
          content: 'The place is at a superb location in very nice and clean building, Nansi gave me perfect directions to the apartment so it was really easy to find. The building is very Parisian, nice & clean, the apartment is very tiny but very nice and stylish. Would reccomend it.',
          updatedAt: new Date(),
          memberLink: '',
          name: 'bao linh',
          avatar: 'https://cdn.24h.com.vn/upload/4-2019/images/2019-10-07/1-1570413285-2-width650height972.jpg' 
        }
      ]
    },



    group: 'Verified',
    geographic: {
      province: {
        label: 'Đường Nguyễn Hữu Cảnh Quận Bình Thạnh TP HCM',
        key: '330000',
      },
    },

    confirm: {
      userConfirm: [
        {
          name: 'Selfie Picture',
          isConfirm: true
        },
        {
          name: 'Email address',
          isConfirm: true
        },

        {
          name: 'Phone number',
          isConfirm: true
        },

        {
          name: 'Work email',
          isConfirm: true
        },
        {
          name: 'Government ID',
          isConfirm: true
        }
      ]
    },
  },
};
