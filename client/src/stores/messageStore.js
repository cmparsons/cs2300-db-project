import { observable, action, runInAction, computed } from 'mobx';
import values from 'lodash/values';

import RequestLayer from '../middlewares/requestLayer';
import TransportLayer from '../middlewares/transportLayer';
import uiStore from './uiStore';

class MessageStore {
  @observable messages = [];
  @observable selectedMessages = [];
  @observable isLoading = false;
  @observable errors;

  @observable body = '';
  @observable receiver = '';
  @observable searchFilter = '';

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
  toggleSelected(id, checked) {
    if (checked) {
      this.selectedMessages.push(id);
    } else {
      const messageIdx = this.selectedMessages.findIndex(msgId => msgId === id);
      this.selectedMessages.splice(messageIdx, 1);
    }
  }

  @action
  setReceiver(receiver) {
    this.receiver = receiver;
  }

  @action
  setBody(body) {
    this.body = body;
  }

  @action
  setMailFilter(filter) {
    this.searchFilter = filter;
  }

  @action
  clearErrors() {
    this.errors = undefined;
  }

  @action
  reset() {
    this.body = '';
    this.receiver = '';
    this.clearErrors();
  }

  @computed
  get messageList() {
    // Filters messages that don't contain the filter in the message body nor sender username
    return this.messages.filter(message =>
      message.body.toLowerCase().indexOf(this.searchFilter.toLowerCase()) !== -1 &&
        message.sender.toLowerCase().indexOf(this.searchFilter.toLowerCase() !== -1));
  }

  @action.bound
  async createMessage() {
    try {
      this.isLoading = true;
      await this.transportLayer.createMessage({
        body: this.body,
        receiver: this.receiver,
      });
      runInAction(() => {
        this.isLoading = false;
        uiStore.addAlertMessage('Success', 'Successfully sent message!', 'success');
      });
    } catch (err) {
      runInAction(() => {
        console.log(err);
        this.isLoading = false;
        this.errors = err && err.response && err.response.data;
        uiStore.addAlertMessage(
          'Uh-oh!',
          'Something happened and your message could not be sent!',
          'negative',
        );
      });
    }
  }

  // @action.bound
  // async deletePost(postId) {
  //   const postIdx = this.posts.findIndex(p => p.id === postId);
  //   if (postIdx !== -1) {
  //     this.posts.splice(postIdx, 1);
  //     try {
  //       await this.transportLayer.deletePost(postId);
  //       uiStore.addAlertMessage('Success!', 'Successfully deleted post!', 'success');
  //     } catch (err) {
  //       runInAction(async () => {
  //         console.log(err);
  //         this.isLoading = true;
  //         await this.fetchAllPosts();
  //         uiStore.addAlertMessage(
  //           'Uh-oh!',
  //           'Something happened and your post could not be deleted!',
  //           'negative',
  //         );
  //         this.isLoading = false;
  //       });
  //     }
  //   }
  // }

  @action
  async fetchInboxMessages() {
    try {
      this.isLoading = true;
      const messages = await this.requestLayer.fetchInboxMessages();
      runInAction(() => {
        this.messages = messages;
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
  async fetchSentMessages() {
    try {
      this.isLoading = true;
      const messages = await this.requestLayer.fetchSentMessages();
      runInAction(() => {
        this.messages = messages;
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

export default new MessageStore();
