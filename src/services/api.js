import axios from 'axios';
import LocalStorage from 'utils/LocalStorage';

export default class {
  constructor(path) {
    this.path = path;
  }

  init = async () => {
    let headers = {'Accept': 'application/json'};
    headers['Authorization'] = await LocalStorage.getAccessToken();

    this.instance = axios.create({baseURL: `${process.env.ENDPOINT}/${this.path}`, headers,});

    // Add a response interceptor
    this.instance.interceptors.response.use(function (response) {
      // Do something with response data
      let output = response['data'];

      output['responseStatus'] = response.status;
      return output;
    }, function (error) {
      // Do something with response error
      // if (error.response && error.response.status === 401) router.push(`${window.location.pathname}?login=true`);

      return error.response;
    });
  };

  search = async ({page, per_page, option}) => {
    await this.init();
    return await this.instance.get('/search', {
      params: {
        page: page,
        per_page: per_page,
        option: option,
      },
    });
  };

  create = async (data) => {
    await this.init();
    return await this.instance.post('/', {
      ...data,
    });
  };

  upload = async (data) => {
    await this.init();
    return await this.instance.post('/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  createMultiple = async (data) => {
    await this.init();
    return await this.instance.post(`/multiple`, {
      ...data,
    });
  };

  update = async ({id, data}) => {
    await this.init();
    return await this.instance.put(`/${id}`, {
      ...data,
    });
  };

  getAll = async () => {
    await this.init();
    return await this.instance.get('/');
  };


  get = async (id, isUpdate) => {
    await this.init();
    return await this.instance.get(`/${id}${isUpdate ? '?isUpdate=true' : ''}`);
  };

  delete = async (id) => {
    await this.init();
    return await this.instance.delete(`/${id}`);
  };

  deleteImage = async (buildingId, imageId) => {
    await this.init();
    return await this.instance.delete(`/${buildingId}/${imageId}`);
  };

  updateProfile = async (data) => {
    await this.init();
    return await this.instance.put('/', {
      ...data,
    });
  };

  changePassword = async (data) => {
    await this.init();
    return await this.instance.post('/change-password', data);
  }

}
