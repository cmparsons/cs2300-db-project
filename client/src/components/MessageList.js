import React, { Fragment } from 'react';
import { Header, List, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function MessageList({ messages }) {
  return (
    <Fragment>
      <Header as="h3" attached="top" block>
        <Icon name="inbox" />
        Messages
      </Header>
      <Segment attached>
        <List divided verticalAlign="middle">
          {messages.map(message => (
            <List.Item key={message.id}>
              <List.Content floated="right" content={message.createdAt.toLocaleDateString()} />
              <List.Content float="left">
                <List.Header as={Link} to={message.route} content={message.sender} />
                <List.Description content={message.body} />
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
}
