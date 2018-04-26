import React, { Fragment } from 'react';
import { Icon, Header, Image, Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function PostList(props) {
  const posts = props.posts.length ? (
    <Card.Group>
      {props.posts.map(post => (
        <Card
          fluid
          key={`post-${post.id}`}
          as={Link}
          to={`/community/${post.communityId}/${post.id}`}
        >
          <Card.Content>
            <Card.Header content={post.title} />
            <Card.Meta content={`${post.poster} ${new Date(post.createdAt).toDateString()}`} />
            <Card.Description content={post.body} />
            {post.url && (
              <div style={{ padding: 10 }}>
                <Image src={post.url} size="medium" centered />
              </div>
            )}
          </Card.Content>
          <Card.Content textAlign="right" extra>
            <Icon color="blue" name="comments" /> 121 Comments
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  ) : (
    <p>No posts yet...</p>
  );
  return (
    <Fragment>
      <Header as="h1" textAlign="center" content={props.communityName} />
      {posts}
    </Fragment>
  );
}
