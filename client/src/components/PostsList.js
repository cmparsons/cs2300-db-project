import React, { Fragment } from 'react';
import { Item, Icon, Header, ItemGroup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function PostList(props) {
  const posts = props.posts.length ? (
    <ItemGroup divided>
      {props.posts.map(post => (
        <Item key={post.id}>
          <Item.Content>
            <Item.Header
              as={Link}
              to={`/community/${post.communityId}/${post.id}`}
              content={post.title}
            />
            <Item.Meta content={`${post.poster} ${new Date(post.createdAt).toDateString()}`} />
            <Item.Description content={post.body} />
            <Item.Extra as={Link} to={`/community/${post.communityId}/${post.id}`}>
              <Icon color="blue" name="comments" /> 121 Comments
            </Item.Extra>
          </Item.Content>
        </Item>
      ))}
    </ItemGroup>
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
