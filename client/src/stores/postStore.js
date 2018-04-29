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
  @observable url = '';

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
  setUrl(url) {
    this.url = url;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  @action
  reset() {
    this.title = '';
    this.body = '';
    this.url = '';
    this.clearErrors();
    this.currentPost = undefined;
  }

  getPost(id) {
    return this.posts.find(p => p.id === id);
  }

  @action
  async loadPostData(postId) {
    const post = this.getPost(postId);
    if (post) {
      this.setTitle(post.title);
      this.setBody(post.body);
      this.setUrl(post.url);
    } else {
      await this.loadPost(postId);
      runInAction(() => {
        this.setTitle(this.currentPost.title);
        this.setBody(this.currentPost.body);
        this.setUrl(this.currentPost.url);
      });
    }
  }

  @action
  async loadPost(postId) {
    const post = this.getPost(postId);
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
    try {
      this.isLoading = true;
      this.clearErrors();
      const post = await this.transportLayer.createPost(
        { title: this.title, body: this.body, url: this.url },
        this.communityId,
      );
      runInAction(() => {
        this.posts.push(post);
        this.currentPost = post;
        this.isLoading = false;
        uiStore.addAlertMessage('Successfully created post!', 'Hot Dog!', 'success');
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isLoading = false;
        this.errors = err && err.response && err.response.data;
        uiStore.addAlertMessage(
          'Uh-oh!',
          'Something happened and your post could not be created!',
          'negative',
        );
      });
    }
  }

  @action
  async updatePost(postId) {
    const post = this.getPost(postId);
    if (post) {
      try {
        this.isLoading = true;
        this.clearErrors();
        await this.transportLayer.updatePost(
          { title: this.title, body: this.body, url: this.url },
          postId,
        );
        runInAction(() => {
          const postIdx = this.posts.findIndex(p => p.id === postId);
          this.posts[postIdx] = {
            ...post,
            title: this.title,
            body: this.body,
            url: this.url,
          };
          this.isLoading = false;
          uiStore.addAlertMessage('Successfully updated post!', 'Hot Dog!', 'success');
        });
      } catch (err) {
        runInAction(() => {
          console.log(err);
          this.isLoading = false;
          this.errors = err && err.response && err.response.data;
          uiStore.addAlertMessage(
            'Uh-oh!',
            'Something happened and your post could not be updated!',
            'negative',
          );
        });
      }
    }
  }

  @action
  async submitPost(postId) {
    if (postId) {
      await this.updatePost(postId);
    } else {
      await this.createPost();
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
        runInAction(async () => {
          console.log(err);
          this.isLoading = true;
          await this.fetchAllPosts();
          uiStore.addAlertMessage(
            'Uh-oh!',
            'Something happened and your post could not be deleted!',
            'negative',
          );
          this.isLoading = false;
        });
      }
    }
  }

  @action
  async fetchAllPosts(filter) {
    try {
      this.isLoading = true;
      const posts = await this.requestLayer.fetchAllPosts(filter);
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
