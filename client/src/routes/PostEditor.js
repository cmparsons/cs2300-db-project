import React, { Component } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';

@inject('postStore')
@observer
export default class CreatePost extends Component {
  componentDidMount() {
    const communityId =
      this.props.match.params.communityId && parseInt(this.props.match.params.communityId, 10);
    this.props.postStore.setCommunity(communityId);
  }

  componentWillUnmount() {
    this.props.postStore.reset();
  }

  handleTitleChange = (e) => {
    this.props.postStore.setTitle(e.target.value);
  };

  handleBodyChange = (e) => {
    this.props.postStore.setBody(e.target.value);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const postId = await this.props.postStore.createPost();
    if (postId) {
      this.props.history.push(`/community/${this.props.match.params.communityId}/${postId}`);
    }
  };
  render() {
    const {
      title, body, errors, isLoading,
    } = this.props.postStore;
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
          name="title"
          label="Title"
          placeholder="Title"
          value={title}
          autoComplete="off"
          error={errors && !!errors.title}
          onChange={this.handleTitleChange}
        />
        <Form.TextArea
          autoHeight
          name="body"
          label="Body"
          placeholder="Body"
          value={body}
          rows={5}
          error={errors && !!errors.body}
          onChange={this.handleBodyChange}
        />
        <Form.Button color="blue">Create Post</Form.Button>
        {!!errorList.length && (
          <Message error header="There was some errors with your submission" list={errorList} />
        )}
      </Form>
    );
  }
}
