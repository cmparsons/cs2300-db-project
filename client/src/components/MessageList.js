import React, { Fragment } from 'react';
import { Header, List, Segment, Icon, Checkbox } from 'semantic-ui-react';

export default function MessageList({ messages, context, onChange }) {
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
              <List.Content floated="left">
                <Checkbox id={message.id} onChange={onChange} />
              </List.Content>
              <List.Content floated="left">
                <List.Header
                  content={context === 'inbox' ? `${message.sender}` : `To: ${message.receiver}`}
                />
                <List.Description content={message.body} />
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
}
