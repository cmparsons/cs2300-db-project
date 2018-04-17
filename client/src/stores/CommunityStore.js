import { observable, action, runInAction } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';

class CommunityStore {
  @observable communities = [];
  @observable communityId;
  @observable isLoading = false;

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();
  }

  @action
  async fetchAllCommunities() {
    try {
      this.isLoading = true;
      const communities = await this.requestLayer.fetchAllCommunities();
      runInAction(() => {
        this.communities = communities;
      });
    } catch (err) {
      console.log(err);
    }

    this.isLoading = false;
  }

  @action
  async createCommunity() {
    try {
      const communityId = await this.transportLayer.createCommunity();
      runInAction(() => {
        this.communityId = communityId;
      });
    } catch (err) {
      console.log(err);
    }
  }
}

export default new CommunityStore();
