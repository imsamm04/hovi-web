import {
  formatterCurrency,
  getPartUrl,
  buildQuerySearch,
  isFunction,
  isObject,
  getGender,
  parserCurrency,
  removeDuplicate,
  removeUnicode,
  normalizePhoneNumber
} from '../index';

const defaultValue = {
  price: [0, 100000000],
  area: [10, 1000],
  capacity: [1, 20],
  radius: 0.5,
  amenities: [],
  roomTypes: [],
  direction: "",
  location: {},
  gender: 2,
};

describe('utils: checkCompareFilter', () => {

  describe('Test formatterCurrentcy function', () => {
    it('TC1: Test formatterCurrency function', () => {

      const input = 10000;
      const output = '10,000';

      const check = formatterCurrency(input);
      expect(check).toBe(output);
    });
  });

  describe('Test parserCurrency function', () => {
    it('TC2: Test parserCurrency function', () => {
      const check = parserCurrency('3,468');
      expect(check).toBe('3468');
    });
  });

  describe('Test getPartUrl function', () => {
    it('TC3A: test normal flow price', () => {
      const input = {};
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });


    it('TC3B: test price normal flow', () => {
      const input = {
        price: '1000000, 5000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: [1000000, 5000000],
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC3C: Test incorrect input price', () => {
      const input = {
        price: '-1000000000000, 5000000000000000000000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: [0, 100000000],
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC3D: Test incorrect input string ', () => {
      const input = {
        price: '-10eddededede0000, abcdef00000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: [0, 100000000],
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC3E: Test incorrect input string ', () => {
      const input = {
        price: '-100000, 1000000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: [0, 100000000],
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC3F: Test incorrect input string ', () => {
      const input = {
        price: '0, 300000000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: [0, 100000000],
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });


    it('TC4A: test amenities normal flow', () => {
      const input = {
        price: '0, 100000000',
        amenities: '1,2,3,4,5',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: [1, 2, 3, 4, 5],
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC3D: Test incorrect input string ', () => {
      const input = {
        price: '-10eddededede0000, abcdef00000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: [0, 100000000],
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });


    it('TC4C: Test incorrect input string', () => {
      const input = {
        price: '0, 100000000',
        amenities: 'a,b,c,d,e',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: [],
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC4B: Test incorrect input string', () => {
      const input = {
        price: '0, 100000000',
        amenities: 'abcdef',
        gender: '2',
        types: '',
        capacity: '',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: [],
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC5A: test normal roomTypes', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '1,2',
        capacity: '',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: [1, 2],
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC5B: Test incorrect input roomTypes', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '1,2,abcdef',
        capacity: '',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: [1, 2],
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC6A: test normal capacity ', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '3,6',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: [3, 6],
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location
      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC6B: Test incorrect input capacity', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '1,abcdef',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: [1, 20],
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC6C: Test incorrect input capacity', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '1,40',
        area: ''

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: [1, 20],
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });
    it('TC7A: Test incorrect input area', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: '10,300'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: [10, 300],
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC7B: ', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '1,20',
        area: '10,abcdef'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: [10, 1000],
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC7C: Test incorrect input area', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '1,20',
        area: '70,-100000000'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: [70, 10],
        capacity: defaultValue.capacity,
        direction: defaultValue.direction,
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC8A: test normal flow direction ', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: '',
        direction: 'Nam'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: 'Nam',
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC8B: Test incorrect input direction', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '1,20',
        area: '10,1000',
        direction: 'abcdef'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: '',
        radius: defaultValue.radius,
        location: defaultValue.location


      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });

    it('TC8C: Test incorrect input direction', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '1,20',
        area: '10,1000',
        direction: '123abc'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: '',
        radius: defaultValue.radius,
        location: defaultValue.location
      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });


    it('TC8D: test normal flow direction ', () => {
      const input = {
        price: '0, 100000000',
        amenities: '',
        gender: '2',
        types: '',
        capacity: '',
        area: '',
        direction: '123'

      };
      const output = {
        price: defaultValue.price,
        gender: defaultValue.gender,
        amenities: defaultValue.amenities,
        roomTypes: defaultValue.roomTypes,
        area: defaultValue.area,
        capacity: defaultValue.capacity,
        direction: '',
        radius: defaultValue.radius,
        location: defaultValue.location

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });


    // it('TC9A: Test normal location', () => {
    //   const input = {
    //     price: '',
    //     amenities: '',
    //     gender: '2',
    //     types: '',
    //     capacity: '',
    //     area: '',
    //     direction:'',
    //     location: '2,0',


    //   };
    //   const output = {
    //     price: defaultValue.price,
    //     gender: defaultValue.gender,
    //     amenities: defaultValue.amenities,
    //     roomTypes: defaultValue.roomTypes,
    //     area: defaultValue.area,
    //     capacity: defaultValue.capacity,
    //     direction: defaultValue.direction,
    //     radius: defaultValue.radius,
    //     location: {
    //       lat: 2,
    //       lng: 0,

    //     }
    //   };
    //   const check = getPartUrl(input, 'getOptionsSearchFromUrl');
    //   expect(check).toEqual(output);
    // });

    describe('Test buildQuerySearch function', () => {
      it('TC9A: test normal input price ', () => {
        const input = {
          price: [0, 11000000],
          gender: defaultValue.gender,
          amenities: defaultValue.amenities,
          types: defaultValue.types,
          location: {}

        };
        const output = {
          price: '0,11000000',
          gender: defaultValue.gender,
          amenities: defaultValue.amenities,
          roomTypes: defaultValue.roomTypes,
          types: defaultValue.types,
          address: 'hòa lạc',


        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC9B: test normal input price', () => {
        const input = {
          price: [0, 100000000],
          gender: defaultValue.gender,
          amenities: [],
          types: defaultValue.types,
          location: {}
        };
        const output = {
          gender: defaultValue.gender,
          amenities: defaultValue.amenities,
          roomTypes: defaultValue.roomTypes,
          types: defaultValue.types,


        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC10A: test normal input price', () => {
        const input = {
          price: [2000000, 10000000],
          gender: defaultValue.gender,
          amenities: defaultValue.amenities,
          roomTypes: defaultValue.roomTypes,
          types: defaultValue.types,
          location: {}
        };
        const output = {
          price: '2000000,10000000',
          gender: defaultValue.gender,
          amenities: defaultValue.amenities,
          roomTypes: defaultValue.roomTypes,
          types: defaultValue.types,

        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC10B: Test normal amenities input', () => {
        const input = {
          price: [0, 100000000],
          amenities: [1, 2],
          gender: 0,
          types: 2,
          location: {}

        };
        const output = {
          amenities: '1,2',
          gender: defaultValue.gender,
          // amenities: defaultValue.amenities,
          roomTypes: defaultValue.roomTypes,
          types: defaultValue.types,


        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC10C: Test buildQuerySearch function', () => {
        const input = {
          price: [0, 100000000],
          amenities: [1, 2, 3, 4, 5, 6, 7],
          gender: 0,
          types: 2,
          location: {}

        };
        const output = {
          amenities: '1,2,3,4,5,6,7',
          gender: 0,
          roomTypes: 2,
          types: 2,
          address: 'hòa lạc',
          location: '21.0090571,105.86075069999993',

        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC11A: Test normal roomtyles', () => {
        const input = {
          price: [0, 100000000],
          gender: 0,
          types: [1, 2],
          location: {}

        };
        const output = {
          gender: 0,
          types: '1,2',
          location: '2,0',

        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC11B: Test normal roomtyles', () => {
        const input = {
          location: {}

        };
        const output = {};
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC12A: Test normal flow capacity', () => {
        const input = {
          price: [0, 100000000],
          capacity: [1, 20],
          gender: 0,
          location: {}
        };
        const output = {
          gender: 0,
          area: [10, 1000],
          direction: "",
          radius: 0.5,

        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC12B:  Test normal flow capacity', () => {
        const input = {
          price: [0, 100000000],
          capacity: [3, 5],
          gender: 0,
          location: {}

        };
        const output = {
          capacity: '3,5',
          area: [10, 1000],
          direction: "",
          radius: 0.5,
          location: {}
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC12C:  Test incorrect flow capacity', () => {
        const input = {
          price: [0, 100000000],
          capacity: [3, 50],
          gender: 0,
          location: {}

        };
        const output = {
          capacity: '3,20',
          area: [10, 1000],
          direction: "",
          radius: 0.5,
          location: {}
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC12D:  Test incorrect flow capacity', () => {
        const input = {
          price: [0, 100000000],
          capacity: [-3, 50],
          gender: 0,
          location: {}

        };
        const output = {
          capacity: '1,20',
          area: [10, 1000],
          direction: "",
          radius: 0.5,
          location: {}
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC13A: Test normal flow radius', () => {
        const input = {
          capacity: [1, 20],
          gender: 0,
          location: {},
          radius: 0.5,
        };
        const output = {
          area: [10, 1000],
          direction: "",
          radius: '1',
          location: {}
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC13B: Test normal flow radius', () => {
        const input = {
          radius: 10.5,
          location: {}

        };
        const output = {
          area: defaultValue.area,
          direction: defaultValue.direction,
          radius: 10.5,
          location: {}
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC14A: Test normal flow area', () => {
        const input = {
          price: [0, 5000000],
          capacity: [1, 10],
          area: [10, 30],
          direction: "",
          location: {}

        };
        const output = {
          price: '0,5000000',
          capacity: '1,10',
          area: '10,30',
          location: "",
          direction: "",
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC14B: Test incorrect flow area', () => {
        const input = {
          price: defaultValue.price,
          capacity: defaultValue.capacity,
          area: [-10, 550],
          direction: defaultValue.direction,
          location: {}

        };
        const output = {
          area: '10,550',
          location: "",
          direction: "",
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC15A: Test normal flow direction', () => {
        const input = {
          price: defaultValue.price,
          capacity: defaultValue.capacity,
          area: defaultValue.area,
          radius: defaultValue.radius,
          direction: "Tây Nam",
          location: {}

        };
        const output = {
          direction: "Tây Nam",
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC15B: Test normal flow direction', () => {
        const input = {
          price: defaultValue.price,
          capacity: defaultValue.capacity,
          area: defaultValue.area,
          radius: defaultValue.radius,
          direction: "Tây Nam",
          location: {
            address: "Ha noi",
            lat: 2,
            lng: 0,
          }

        };
        const output = {
          address: "Ha noi",
          direction: "Tây Nam",
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });


      it('TC16A: Test ', () => {
        const input = {
          price: [0, 100000000],
          capacity: [1, 20],
          area: [10, 50],
          radius: 3,
          direction: "Tây Bắc",
          location: {
            address: "Ha noi",
            lat: 2,
            lng: 0,
          }

        };
        const output = {
          radius: '3',
          area: '10,50',
          address: "Ha noi",
          direction: "Tây Bắc",
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

      it('TC44: Test buildQuerySearch function', () => {
        const input = {
          price: [0, 12000000],
          gender: 2,
          amenities: [1, 2, 3],
          roomTypes: [2, 3],
          area: [30, 30],
          capacity: [1, 10],
          direction: "",
          radius: 3,
          location: {
            address: "Đường láng",
            lat: 2,
            lng: 0,
          }

        };
        const output = {
          price: '0,12000000',
          gender: '2',
          amenities: '1,2,3',
          roomTypes: '2,3',
          area: '20, 30',
          capacity: '1, 10',
          direction: "",
          radius: '3',
          address: 'Đường láng',
          location: '2,0'
        };
        const check = buildQuerySearch(input);
        expect(check.price).toEqual(output.price);
      });

    });
    describe('Test removeUnicode function', () => {

      it('TC45: Test removeUnicode function', () => {
        const input = 'Abc';
        const output = 'Abc';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });
      it('TC46: Test removeUnicode function', () => {
        const input = 'Abc';
        const output = 'Abc';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });

      it('TC47: Test removeUnicode function', () => {
        const input = 'Hồ gươm';
        const output = 'Ho guom';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });

      it('TC48: Test removeUnicode function', () => {
        const input = 'Đại học bách khoa-hà nội';
        const output = 'Dai hoc bach khoa-ha noi';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });

      it('TC49: Test removeUnicode function', () => {
        const input = 'đại học bách khoa hà nội';
        const output = 'dai hoc bach khoa ha noi';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });

      it('TC50: Test removeUnicode function', () => {
        const input = '30 võ duy thanh';
        const output = '30 vo duy thanh';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });


      it('TC51: Test removeUnicode function', () => {
        const input = 'ngõ 52 Trường chinh - vương kỵ';
        const output = 'ngo 52 Truong chinh - vuong ky';

        const check = removeUnicode(input);
        expect(check).toEqual(output);
      });
    });


    it('TC52: Test removeDuplicate function', () => {
      const input = ['quan', 'hoan', 'kiem', 'ha', 'ha', 'noi'];
      const output = ['quan', 'hoan', 'kiem', 'ha', 'noi'];

      const check = removeDuplicate(input);
      expect(check).toEqual(output);
    });

    it('TC53: Test removeDuplicate function', () => {
      const input = ['quận', 'hoan', 'kiem', 'hà', 'hà', 'noi'];
      const output = ['quận', 'hoan', 'kiem', 'hà', 'noi'];

      const check = removeDuplicate(input);
      expect(check).toEqual(output);
    });

    it('TC54: Test removeDuplicate function', () => {
      const input = ['30', '30', '30', 'xã', 'đàn'];
      const output = ['30', 'xã', 'đàn'];

      const check = removeDuplicate(input);
      expect(check).toEqual(output);
    });

    // it('TC37: Test normalizePhoneNumber function', () => {
    //   const input = 386666428;
    //   const output = 386666428;

    //   const check = normalizePhoneNumber(input);
    //   expect(check).toEqual(output);
    // });


    // it('TC37: Test isFunction function', () => {
    //   const input = removeDuplicate;
    //   const output = true;

    //   const check = isFunction(input);
    //   expect(check).toEqual(output);
    // });

    //   it('TC37: Test isFunction function', () => {
    //     const input = ()=>{normalizePhoneNumber()}
    //     const output = true;
    //     const check = isFunction(input);
    //     expect(check).toEqual(output);
    // });

    // it('TC38: Test isObject function', () => {
    //   const input = ()=>{abc}
    //   const output = false;
    //   const check = isObject(input);
    //   expect(check).toEqual(output);
    // });

    // it('TC39: Test isObject function', () => {
    //   const input = ()=>{edsedsed}
    //   const output = false;
    //   const check = isObject(input);
    //   expect(check).toEqual(output);
    // });

    // it('TC40: Test normalizePhoneNumber function', () => {
    //   const input = "+84386666428"
    //   const output = "0386666428"
    //   const check = normalizePhoneNumber(input);
    //   expect(check).toEqual(output);
    // });

    // it('TC39: Test getGender function', () => {
    //   const input = {code: 0, name: 'Nam'};
    //   const output = {code: 0, name: 'Nam'}
    //   const check = getGender(input);
    //   expect(check).toEqual(output);
    // });

    it('TC55: Test getPartUrl function', () => {
      const input = {
        price: '1000000,2000000',
        gender: '1',
        amenities: '1,2',
        types: '1,2',

      };
      const output = {
        price: [1000000, 2000000],
        gender: 1,
        amenities: [1, 2],
        roomTypes: [1, 2],
        area: [10, 1000],
        capacity: [1, 20],
        direction: "",
        radius: 0.5,
        location: {}

      };
      const check = getPartUrl(input, 'getOptionsSearchFromUrl');
      expect(check).toEqual(output);
    });


  });
});
