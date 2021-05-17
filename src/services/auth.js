import axios from 'axios';

export default class Auth {
  constructor() {
    this.instance = axios.create({
      baseURL: `${process.env.ENDPOINT}/auth`,
      headers: {'Accept': 'application/json'},
    });
  }

  signIn = async (data) => {
    return await this.instance.post('/login', {
      ...data,
    });
  };

  resetPassword = async (data) => {
    return await this.instance.post('/reset-password', data);
  };

  forgotPassword = async (data) => {
    return await this.instance.post('/forgot-password', data);
  };

  verifyEmail = async (data) => {
    return await this.instance.post('/verify-email', {
      ...data,
    });
  };

  verifyPhoneNumber = async (data) => {
    return await this.instance.post('/verify-phone-number', {
      ...data,
    });
  };

  register = async (data) => {
    return await this.instance.post('/register', {
      ...data,
    });
  };

  currentSession = async (accessToken) => {
    return await this.instance.post('/check', {
      accessToken: accessToken,
    });
  };
}
