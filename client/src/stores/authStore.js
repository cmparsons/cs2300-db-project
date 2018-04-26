import { action, reaction, observable, computed, runInAction } from 'mobx';
import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import userStore from './userStore';

class AuthStore {
  @observable token = localStorage.getItem('cs2300-token');
  @observable errors = undefined;
  @observable isLoading = false;

  @action
  setToken(token) {
    this.token = token;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  @action
  async login(identifier, password) {
    this.isLoading = true;
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
  async register(username, email, password) {
    this.isLoading = true;
    try {
      const token = await this.transportLayer.register(username, email, password);
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

    if (this.token) {
      userStore.getCurrentUser();
    }

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
