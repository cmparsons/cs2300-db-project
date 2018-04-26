import React, { Component } from 'react';
import { Form, Message, Image } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';

@inject('postStore')
@observer
export default class PostEditor extends Component {
  async componentDidMount() {
    const communityId =
      this.props.match.params.communityId && parseInt(this.props.match.params.communityId, 10);
    const postId = this.props.match.params.postId && parseInt(this.props.match.params.postId, 10);
    this.props.postStore.setCommunity(communityId);

    if (postId) {
      await this.props.postStore.loadPostData(postId);
    }
  }

  componentWillUnmount() {
    this.props.postStore.reset();
  }

  handleTitleChange = (e) => {
    this.props.postStore.setTitle(e.target.value);
  };

  handleImageChange = (e) => {
    this.props.postStore.setUrl(e.target.value);
  };

  handleBodyChange = (e) => {
    this.props.postStore.setBody(e.target.value);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const postId = this.props.match.params.postId && parseInt(this.props.match.params.postId, 10);
    await this.props.postStore.submitPost(postId);
    if (!this.props.postStore.errors) {
      this.props.history.push(`/community/${this.props.match.params.communityId}/${postId ||
          this.props.postStore.currentPost.id}`);
    }
  };
  render() {
    const {
      title, body, url, errors, isLoading,
    } = this.props.postStore;
    const errorList = isEmpty(errors) ? [] : values(errors);
    const isNewPost = !this.props.match.params.postId;

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
        <Form.Input
          fluid
          name="url"
          label="Image"
          placeholder="Image URL"
          value={url}
          autoComplete="off"
          onChange={this.handleImageChange}
        />
        {url && <Image src={url} centered size="medium" />}
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
        <Form.Button color="blue">{isNewPost ? 'Create Post' : 'Update Post'}</Form.Button>
        {!!errorList.length && (
          <Message error header="There was some errors with your submission" list={errorList} />
        )}
      </Form>
    );
  }
}
