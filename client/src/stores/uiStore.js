import { observable, action } from 'mobx';

class UiStore {
  @observable alertMessages = [];

  @action
  addAlertMessage(header, content, type) {
    this.alertMessages.push({
      id: this.generateId(),
      header,
      content,
      type,
    });
  }

  @action.bound
  deleteAlertMessage(id) {
    this.alertMessages = this.alertMessages.filter(m => m.id !== id);
  }

  /**
   * Generate a random number (and hopefully unique) to use as an id
   * @returns Random number to use as an id
   */
  generateId = () => new Date().getTime();
}

export default new UiStore();
