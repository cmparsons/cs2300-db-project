import { action, reaction, observable, computed } from 'mobx';
import decode from 'jwt-decode';

class UserStore {
  @observable token = localStorage.getItem('cs2300-token');

  @action
  setToken(token) {
    this.token = token;
  }

  @computed
  get isAuthenticated() {
    return !!this.token;
  }

  @computed
  get user() {
    try {
      const { userId } = decode(this.token);
      return userId;
    } catch (e) {
      return null;
    }
  }
  constructor() {
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

  logoutUser = () => {
    this.token = '';
  };
}

export default new UserStore();
