import React, { Component, Fragment } from 'react';
import { Item, Button, Divider, Loader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('postStore', 'userStore')
@observer
export default class Post extends Component {
  componentDidMount() {
    const postId = this.props.match.params.postId && parseInt(this.props.match.params.postId, 10);
    this.props.postStore.loadPost(postId);
  }

  handleDeleteClick = async () => {
    const { currentPost, deletePost } = this.props.postStore;
    deletePost(currentPost.id);
    this.props.history.push(`/community/${this.props.match.params.communityId}`);
  };

  handleEditClick = (e) => {
    console.log('edit post');
  };

  render() {
    const { currentPost, isLoading } = this.props.postStore;
    const { user } = this.props.userStore;

    if (isLoading) {
      return <Loader />;
    }

    if (!currentPost) {
      return null;
    }

    return (
      <Fragment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header content={currentPost.title} />
              <Item.Meta
                content={`${currentPost.poster} ${new Date(currentPost.createdAt).toDateString()}`}
              />
              <Item.Description content={currentPost.body} />
              {user.username === currentPost.poster && (
                <Item.Extra>
                  <Button
                    color="red"
                    floated="right"
                    content="Delete"
                    onClick={this.handleDeleteClick}
                  />
                  <Button secondary floated="right" content="Edit" onClick={this.handleEditClick} />
                </Item.Extra>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
        <Divider section />
      </Fragment>
    );
  }
}
