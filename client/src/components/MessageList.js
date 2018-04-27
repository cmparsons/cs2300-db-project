import React, { Fragment } from 'react';
import { Header, List, Segment, Icon } from 'semantic-ui-react';

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
              <List.Content
                floated="right"
                content={new Date(message.createdAt).toLocaleDateString()}
              />
              <List.Content float="left">
                <List.Header content={message.sender} />
                <List.Description content={message.body} />
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
}
