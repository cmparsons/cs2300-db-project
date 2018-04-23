import { observable, action, runInAction } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
// import uiStore from './uiStore';

class PostStore {
  @observable posts = [];
  @observable isLoading = false;

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();
  }

  @action
  async fetchAllPosts() {
    try {
      this.isLoading = true;
      const posts = await this.requestLayer.fetchAllPosts();
      runInAction(() => {
        this.posts = posts;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isLoading = false;
      });
    }
  }

  @action
  async fetchPostsForCommunity(communityId) {
    try {
      this.isLoading = true;
      const posts = await this.requestLayer.fetchPostsForCommunity(communityId);
      runInAction(() => {
        this.posts = posts;
        this.isLoading = false;
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isLoading = false;
      });
    }
  }
}

export default new PostStore();
