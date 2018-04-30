import React, { Component, Fragment } from 'react';
import {
  Card,
  Button,
  Divider,
  Loader,
  Comment,
  Header,
  Form,
  Image,
  Message,
} from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import CommentsList from '../components/CommentsList';

@inject('postStore', 'userStore', 'commentsStore')
@observer
export default class Post extends Component {
  async componentDidMount() {
    const postId = this.props.match.params.postId && parseInt(this.props.match.params.postId, 10);
    Promise.all([
      this.props.postStore.loadPost(postId),
      this.props.commentsStore.fetchComments(postId),
    ]);
  }

  componentWillUnmount() {
    this.props.commentsStore.reset();
  }

  handleDeleteClick = async () => {
    const { currentPost, deletePost, errors } = this.props.postStore;
    await deletePost(currentPost.id);
    if (!errors) {
      this.props.history.push(`/community/${this.props.match.params.communityId}`);
    }
  };

  handleCommentChange = e => this.props.commentsStore.setBody(e.target.value);

  handleCommentSubmit = async (e) => {
    e.preventDefault();
    const postId = this.props.match.params.postId && parseInt(this.props.match.params.postId, 10);
    await this.props.commentsStore.createComment(postId);
  };

  render() {
    const { currentPost, isLoading } = this.props.postStore;
    const { user } = this.props.userStore;
    const { communityId, postId } = this.props.match.params;
    const {
      comments, isFetchingComments, body, errorList, hasError,
    } = this.props.commentsStore;

    if (isLoading) {
      return <Loader active />;
    }

    if (!currentPost) {
      return null;
    }

    return (
      <Fragment>
        <Card.Group>
          <Card fluid>
            <Card.Content>
              <Card.Header content={currentPost.title} />
              <Card.Meta
                content={`${currentPost.poster} ${new Date(currentPost.createdAt).toDateString()}`}
              />
              <Card.Description content={currentPost.body} />
              {currentPost.url && (
                <div style={{ padding: 10 }}>
                  <Image src={currentPost.url} size="medium" centered />
                </div>
              )}
            </Card.Content>
            {user &&
              user.username === currentPost.poster && (
                <Card.Content extra>
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
                </Card.Content>
              )}
          </Card>
        </Card.Group>
        <Divider section />
        {isFetchingComments ? (
          <Loader active />
        ) : (
          <Comment.Group>
            <Header as="h3" dividing>
              Comments
            </Header>
            {comments && comments.length > 0 ? (
              <CommentsList comments={comments} />
            ) : (
              <p>No comments yet...</p>
            )}
            <Form reply onSubmit={this.handleCommentSubmit}>
              <Form.TextArea
                error={hasError}
                value={body}
                rows={5}
                autoHeight
                onChange={this.handleCommentChange}
              />
              <Form.Button content="Add Comment" labelPosition="left" icon="edit" primary />
              {hasError && (
                <Message
                  error
                  header="There was some errors with your submission"
                  list={errorList}
                />
              )}
            </Form>
          </Comment.Group>
        )}
      </Fragment>
    );
  }
}
