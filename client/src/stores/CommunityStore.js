import { observable, action, runInAction, computed } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import userStore from './UserStore';

class CommunityStore {
  @observable communities = [];
  @observable communityId;
  @observable isLoading = false;

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();
  }

  /**
   * Get all communities created by the current logged in user
   */
  @computed
  get myCommunities() {
    if (!userStore.user || !userStore.user.id) return [];
    return this.communities.filter(c => c.creatorId === userStore.user.id);
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
