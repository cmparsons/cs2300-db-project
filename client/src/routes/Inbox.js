import React, { Component } from 'react';
import { Grid, GridColumn, Menu, Label, Input } from 'semantic-ui-react';

import MessageList from '../components/MessageList';

const messages = [
  {
    id: 1,
    route: '/',
    sender: 'Sender',
    body: 'test message 1',
    createdAt: new Date(),
  },
  {
    id: 2,
    route: '/',
    sender: 'Sender',
    body: 'test message 2',
    createdAt: new Date(),
  },
  {
    id: 3,
    route: '/',
    sender: 'Sender',
    body: 'test message 3',
    createdAt: new Date(),
  },
];

export default class Inbox extends Component {
  state = {
    activeItem: 'inbox',
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;
    return (
      <Grid container>
        <GridColumn width={4}>
          <Menu vertical>
            <Menu.Item name="inbox" active={activeItem === 'inbox'} onClick={this.handleItemClick}>
              <Label color="teal">{messages.length}</Label>
              Inbox
            </Menu.Item>

            <Menu.Item>
              <Input icon="search" placeholder="Search mail..." />
            </Menu.Item>
          </Menu>
        </GridColumn>
        <GridColumn width={12}>
          <MessageList messages={messages} />
        </GridColumn>
      </Grid>
    );
  }
}
