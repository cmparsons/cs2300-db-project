import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';

@inject('communityStore')
@observer
export default class CreateCommunity extends Component {
  componentWillUnmount() {
    this.props.communityStore.clearErrors();
    this.props.communityStore.setName('');
  }

  handleChange = (e) => {
    this.props.communityStore.setName(e.target.value);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    await this.props.communityStore.createCommunity();
    this.props.history.push('/communities');
  };
  render() {
    const { name, errors, isLoading } = this.props.communityStore;
    const errorList = isEmpty(errors) ? [] : values(errors);

    return (
      <Form
        className="attached fluid segment"
        onSubmit={this.handleSubmit}
        error={!!errorList.length}
        loading={isLoading}
      >
        <Form.Input
          fluid
          name="name"
          label="Community Name"
          placeholder="Community Name"
          value={name}
          autoComplete="off"
          error={errors && !!errors.name}
          onChange={this.handleChange}
        />
        <Form.Button color="blue">Create</Form.Button>
        {!!errorList.length && (
          <Message error header="There was some errors with your submission" list={errorList} />
        )}
      </Form>
    );
  }
}
