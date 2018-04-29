import { observable, action } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';

class UserStore {
  @observable user;

  @action
  async getCurrentUser() {
    try {
      this.user = await this.requestLayer.getCurrentUser();
    } catch (err) {
      console.log(err);
    }
  }

  @action
  clearUser() {
    this.user = undefined;
  }

  constructor() {
    this.requestLayer = new RequestLayer();
  }
}

export default new UserStore();
