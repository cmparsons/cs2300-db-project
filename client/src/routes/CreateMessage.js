import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('messageStore')
@observer
export default class CreateMessage extends Component {
  componentWillUnmount() {
    this.props.messageStore.reset();
  }

  handleReceiverChange = (e) => {
    this.props.messageStore.setReceiver(e.target.value);
  };

  handleBodyChange = (e) => {
    this.props.messageStore.setBody(e.target.value);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.props.messageStore.createMessage();
    if (!this.props.messageStore.hasError) {
      this.props.history.push('/inbox');
    }
  };

  render() {
    const {
      isLoading, receiver, body, errors, errorList, hasError,
    } = this.props.messageStore;

    return (
      <Form
        className="attached fluid segment"
        onSubmit={this.handleSubmit}
        error={hasError}
        loading={isLoading}
      >
        <Form.Input
          fluid
          name="receiver"
          label="To"
          placeholder="To"
          value={receiver}
          autoComplete="off"
          error={hasError && !!errors.receiver}
          onChange={this.handleReceiverChange}
        />
        <Form.TextArea
          autoHeight
          name="body"
          label="Body"
          placeholder="Body"
          value={body}
          rows={5}
          error={hasError && !!errors.body}
          onChange={this.handleBodyChange}
        />
        <Form.Button color="blue" content="Send" />
        {hasError && (
          <Message error header="There was some errors with your message" list={errorList} />
        )}
      </Form>
    );
  }
}
