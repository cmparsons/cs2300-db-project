import { observable, action, runInAction } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import uiStore from './uiStore';

class PostStore {
  @observable posts = [];
  @observable isLoading = false;
  @observable errors;
  @observable communityId;

  @observable title = '';
  @observable body = '';

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();
  }

  @action
  setCommunity(communityId) {
    this.communityId = communityId;
  }

  @action
  setTitle(title) {
    this.title = title;
  }

  @action
  setBody(body) {
    this.body = body;
  }

  @action
  reset() {
    this.title = '';
    this.body = '';
    this.errors = undefined;
  }

  @action
  async createPost() {
    const post = {
      title: this.title,
      body: this.body,
    };
    let postId;
    try {
      this.isLoading = true;
      postId = await this.transportLayer.createPost(post, this.communityId);
      runInAction(() => {
        this.isLoading = false;
        uiStore.addAlertMessage('Successfully created post!', 'Hot Dog!', 'success');
      });
      return postId;
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isLoading = false;
        this.errors = err.response.data;
        uiStore.addAlertMessage(
          'Uh-oh!',
          'Something happened and your post could not be created!',
          'negative',
        );
      });
      return postId;
    }
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
