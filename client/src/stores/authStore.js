import { action, reaction, observable, computed, runInAction } from 'mobx';
import values from 'lodash/values';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import userStore from './userStore';

class AuthStore {
  @observable token = localStorage.getItem('cs2300-token');
  @observable errors = undefined;
  @observable isLoading = false;

  @observable emails = ['', ''];
  @observable username = '';
  @observable password = '';

  @action
  setToken(token) {
    this.token = token;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  @action
  setPrimaryEmail(email) {
    this.emails[0] = email;
  }

  @action
  setAdditionalEmail(email) {
    this.emails[1] = email;
  }

  @action
  setUsername(username) {
    this.username = username;
  }

  @action
  setPassword(password) {
    this.password = password;
  }

  @action
  reset() {
    this.clearErrors();
    this.emails = ['', ''];
    this.username = '';
    this.password = '';
  }

  @computed
  get errorList() {
    if (this.errors !== undefined) {
      return values(this.errors);
    }
    return [];
  }

  @computed
  get hasError() {
    return this.errorList.length > 0;
  }

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  @action
  async login(identifier, password) {
    this.isLoading = true;
    this.clearErrors();
    try {
      const token = await this.transportLayer.login(identifier, password);
      runInAction(async () => {
        this.setToken(token);
        await userStore.getCurrentUser();
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.errors = err && err.response && err.response.data;
        this.isLoading = false;
      });
    }
  }

  @action
  async register() {
    this.isLoading = true;
    this.clearErrors();
    try {
      const token = await this.transportLayer.register(this.username, this.emails, this.password);
      runInAction(async () => {
        this.setToken(token);
        await userStore.getCurrentUser();
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.errors = err && err.response && err.response.data;
        this.isLoading = false;
      });
    }
  }

  @action
  setErrors(errors) {
    this.errors = errors;
  }

  @action
  logout() {
    this.setToken(undefined);
  }

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          this.authenticateUser(token);
        } else {
          this.deauthenticateUser();
        }
      },
    );
  }

  authenticateUser = (token) => {
    localStorage.setItem('cs2300-token', token);
  };

  deauthenticateUser = () => {
    localStorage.removeItem('cs2300-token');
  };
}

export default new AuthStore();
