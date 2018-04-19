import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import AlertMessage from './AlertMessage';

@inject('uiStore')
@observer
export default class AlertMessageList extends Component {
  render() {
    const { alertMessages, deleteAlertMessage } = this.props.uiStore;
    return alertMessages.map(message => (
      <AlertMessage key={message.id} message={message} deleteMessage={deleteAlertMessage} />
    ));
  }
}
