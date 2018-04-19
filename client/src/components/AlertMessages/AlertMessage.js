import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

export default class AlertMessage extends Component {
  handleDismiss = () => {
    this.props.deleteMessage(this.props.message.id);
  };
  render() {
    const { header, content, type } = this.props.message;

    if (type === 'success') {
      return <Message success header={header} content={content} onDismiss={this.handleDismiss} />;
    } else if (type === 'negative') {
      return <Message negative header={header} content={content} onDismiss={this.handleDismiss} />;
    }
    return <Message header={header} content={content} onDismiss={this.handleDismiss} />;
  }
}
