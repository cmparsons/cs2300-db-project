import { observable, action, runInAction, computed } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import userStore from './userStore';
import uiStore from './uiStore';

class CommunityStore {
  @observable communities = [];
  @observable communityId;
  @observable isLoading = false;
  @observable isFetching = false;
  @observable name = '';
  @observable errors = undefined;

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();

    this.isLoading = true;
    this.fetchAllCommunities().finally(() => {
      this.isLoading = false;
    });
  }

  /**
   * Get community's name with the passed id
   * @param {number | undefined} id id of community
   */
  getCommunityName(id) {
    const community = this.communities.find(c => c.id === id);
    return community ? community.name : 'General';
  }

  @action
  setName(name) {
    this.name = name;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  /**
   * Get all communities created by the current logged in user
   */
  @computed
  get myCommunities() {
    if (!userStore.user || !userStore.user.id) return [];
    return this.communities.filter(c => c.creatorId === userStore.user.id);
  }

  /**
   * Get the top 3 communities with most posts
   */
  @computed
  get topCommunitiesLeaderboard() {
    const topCommunities = this.communities
      .filter(c => c.postCount > 0)
      .sort((a, b) => a.postCount < b.postCount)
      .slice(0, 3);

    return topCommunities.map(community => ({
      id: community.id,
      header: community.name,
      route: `/community/${community.id}`,
    }));
  }

  @action
  async fetchAllCommunities() {
    try {
      this.isFetching = true;
      const communities = await this.requestLayer.fetchAllCommunities();
      runInAction(() => {
        this.communities = communities;
        this.isFetching = false;
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isFetching = false;
      });
    }
  }

  @action
  async createCommunity() {
    this.isLoading = true;
    try {
      const communityId = await this.transportLayer.createCommunity(this.name);
      runInAction(() => {
        this.communityId = communityId;
        uiStore.addAlertMessage('Successfully created community!', 'Hot Dog!', 'success');
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        this.errors = err.response.data;
        this.isLoading = false;
      });
    }
  }

  @action
  async deleteCommunity(id) {
    const commIdx = this.communities.findIndex(c => c.id === id);
    if (commIdx !== -1) {
      this.communities.splice(commIdx, 1);
      try {
        await this.transportLayer.deleteCommunity(id);
      } catch (err) {
        runInAction(() => {
          console.log(err);
          this.errors = err.response.data;
          this.isLoading = false;
        });
      }
    }
  }
}

export default new CommunityStore();
