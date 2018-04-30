import { observable, action, computed, runInAction } from 'mobx';
import values from 'lodash/values';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import uiStore from './uiStore';

class CommentsStore {
  @observable comments = [];
  @observable isFetchingComments = false;
  @observable errors = undefined;

  @observable body = '';

  constructor() {
    this.requestLayer = new RequestLayer();
    this.transportLayer = new TransportLayer();
  }

  @computed
  get errorList() {
    if (this.errors !== undefined) {
      return values(this.errors);
    }
    return [];
  }

  @computed
  get hasError() {
    return this.errorList.length > 0;
  }

  @action
  setBody(body) {
    this.body = body;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  @action
  reset() {
    this.body = '';
    this.clearErrors();
  }

  @action
  async createComment(postId) {
    try {
      const comment = await this.transportLayer.createComment(this.body, postId);
      runInAction(() => {
        this.comments.push(comment);
        this.reset();
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.errors = err && err.response && err.response.data;
        uiStore.addAlertMessage(
          'Uh-oh!',
          'Something happened and your comment could not be created!',
          'negative',
        );
      });
    }
  }

  @action
  async fetchComments(postId) {
    try {
      this.isFetchingComments = true;
      const comments = await this.requestLayer.fetchComments(postId);
      runInAction(() => {
        this.comments = comments;
        this.isFetchingComments = false;
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isFetchingComments = false;
      });
    }
  }
}

export default new CommentsStore();
