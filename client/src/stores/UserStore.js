import { extendObservable, action, reaction } from 'mobx';
import decode from 'jwt-decode';

class UserStore {
  constructor() {
    extendObservable(this, {
      token: localStorage.getItem('cs2300-token'),
      setToken: action((token) => {
        this.token = token;
      }),
      get isAuthenticated() {
        return !!this.token;
      },
      get user() {
        try {
          const { user } = decode(this.token);
          return user;
        } catch (e) {
          return null;
        }
      },
    });

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
