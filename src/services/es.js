import axios from 'axios';
import {removeUnicode} from 'utils';

export default class {
  constructor(path) {
    this.instance = axios.create({
      baseURL: `${process.env.ES_ENDPOINT}/${path}`,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Add a response interceptor
    this.instance.interceptors.response.use(function (response) {
      // Do something with response data
      return response['data'];
    }, function (error) {
      // Do something with response error

      return Promise.reject(error.response);
    });
  }

  locationsSearch = async ({address}) => {
    return await this.instance.get('/search', {
      params: {
        text: removeUnicode(address),
      },
    });
  };

  roomsSearch = async ({params}) => {
    return await this.instance.get('/search', {params});
  };

  roomsSuggest = async ({params}) => {
    return await this.instance.get('/suggest', {params});
  };

  getAll = async () => {
    return await this.instance.get('/');
  };

  getById = async (id) => {
    return await this.instance.get('/', {
      params: {
        id,
      },
    });
  };
}
