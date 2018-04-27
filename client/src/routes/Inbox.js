import React, { Component } from 'react';
import { Grid, GridColumn, Menu, Input, Loader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import MessageList from '../components/MessageList';

@inject('messageStore')
@observer
export default class Inbox extends Component {
  state = {
    activeItem: 'inbox',
  };

  async componentDidMount() {
    await this.props.messageStore.fetchInboxMessages();
  }

  async componentDidUpdate(prevProps, prevState) {
    // If the activeItem changed, load the appropriate messages
    if (this.state.activeItem !== prevState.activeItem) {
      if (this.state.activeItem === 'sent') {
        await this.props.messageStore.fetchSentMessages();
      } else {
        await this.props.messageStore.fetchInboxMessages();
      }
    }
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  handleInputChange = (e) => {
    this.props.messageStore.setMailFilter(e.target.value);
  };

  render() {
    const { activeItem } = this.state;
    const { messageList, isLoading, searchFilter } = this.props.messageStore;

    if (isLoading) {
      return <Loader active />;
    }

    return (
      <Grid container>
        <GridColumn width={4}>
          <Menu vertical>
            <Menu.Item name="inbox" active={activeItem === 'inbox'} onClick={this.handleItemClick}>
              Inbox
            </Menu.Item>
            <Menu.Item name="sent" active={activeItem === 'sent'} onClick={this.handleItemClick}>
              Sent
            </Menu.Item>
            <Menu.Item>
              <Input
                icon="search"
                value={searchFilter}
                placeholder="Search mail..."
                onChange={this.handleInputChange}
              />
            </Menu.Item>
          </Menu>
        </GridColumn>
        <GridColumn width={12}>
          <MessageList messages={messageList} />
        </GridColumn>
      </Grid>
    );
  }
}
