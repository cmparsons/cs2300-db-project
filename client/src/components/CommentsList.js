import React from 'react';
import { Comment } from 'semantic-ui-react';

export default function CommentsList({ comments }) {
  return comments.map(comment => (
    <Comment key={`${comment.postId}-${comment.commentId}`}>
      <Comment.Content>
        <Comment.Author as="span" content={comment.username} />
        <Comment.Metadata content={new Date(comment.createdAt).toDateString()} />
        <Comment.Text content={comment.body} />
      </Comment.Content>
    </Comment>
  ));
}
