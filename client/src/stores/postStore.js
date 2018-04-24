import { observable, action, runInAction } from 'mobx';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import uiStore from './uiStore';

class PostStore {
  @observable posts = [];
  @observable isLoading = false;
  @observable errors;
  @observable communityId;
  @observable currentPost;

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
  async loadPost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      this.currentPost = post;
    } else {
      this.isLoading = true;
      try {
        const fetchedPost = await this.requestLayer.fetchPost(postId);
        runInAction(() => {
          this.currentPost = fetchedPost;
          this.posts.push(fetchedPost);
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

  @action.bound
  async deletePost(postId) {
    const postIdx = this.posts.findIndex(p => p.id === postId);
    if (postIdx !== -1) {
      this.posts.splice(postIdx, 1);
      try {
        await this.transportLayer.deletePost(postId);
        uiStore.addAlertMessage('Success!', 'Successfully deleted post!', 'success');
      } catch (err) {
        runInAction(() => {
          console.log(err);
          this.fetchAllPosts();
          uiStore.addAlertMessage(
            'Uh-oh!',
            'Something happened and your post could not be deleted!',
            'negative',
          );
        });
      }
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
