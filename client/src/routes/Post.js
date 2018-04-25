import React, { Component, Fragment } from 'react';
import { Item, Button, Divider, Loader, Comment, Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import CommentsList from '../components/CommentsList';

const comments = [
  {
    commentId: 1,
    postId: 1,
    username: 'Dummy User',
    createdAt: new Date(),
    body: 'dummy comment text',
  },
  {
    commentId: 2,
    postId: 1,
    username: 'Dummy User2',
    createdAt: new Date(),
    body: 'dummy comment text2',
  },
];

@inject('postStore', 'userStore')
@observer
export default class Post extends Component {
  async componentDidMount() {
    const postId = this.props.match.params.postId && parseInt(this.props.match.params.postId, 10);
    await this.props.postStore.loadPost(postId);
  }

  handleDeleteClick = async () => {
    const { currentPost, deletePost, errors } = this.props.postStore;
    await deletePost(currentPost.id);
    if (!errors) {
      this.props.history.push(`/community/${this.props.match.params.communityId}`);
    }
  };

  render() {
    const { currentPost, isLoading } = this.props.postStore;
    const { user } = this.props.userStore;
    const { communityId, postId } = this.props.match.params;

    if (isLoading) {
      return <Loader active />;
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
              {user &&
                user.username === currentPost.poster && (
                  <Item.Extra>
                    <Button
                      color="red"
                      floated="right"
                      content="Delete"
                      onClick={this.handleDeleteClick}
                    />
                    <Button
                      secondary
                      as={Link}
                      to={`/post-editor/${communityId}/${postId}`}
                      floated="right"
                      content="Edit"
                    />
                  </Item.Extra>
                )}
            </Item.Content>
          </Item>
        </Item.Group>
        <Divider section />
        <Comment.Group>
          <Header as="h3" dividing>
            Comments
          </Header>
          {comments && comments.length > 0 ? (
            <CommentsList comments={comments} />
          ) : (
            <p>No comments yet...</p>
          )}
          <Form reply>
            <Form.TextArea />
            <Button content="Add Reply" labelPosition="left" icon="edit" primary />
          </Form>
        </Comment.Group>
      </Fragment>
    );
  }
}
