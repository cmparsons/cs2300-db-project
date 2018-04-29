import React, { Component } from 'react';
import { Grid, GridColumn, Menu, Input, Loader, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

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
      this.props.messageStore.reset();
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

  handleCheckboxChange = (e, { id, checked }) => {
    this.props.messageStore.toggleSelected(id, checked);
  };

  handleDeleteClick = async () => {
    await this.props.messageStore.deleteMessages();
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
          <Button
            content="New Message"
            labelPosition="left"
            icon="edit"
            primary
            as={Link}
            to="/create-message"
          />
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
          <Button
            content="Delete Messages"
            color="red"
            labelPosition="left"
            icon="trash"
            onClick={this.handleDeleteClick}
          />
        </GridColumn>
        <GridColumn width={12}>
          <MessageList
            messages={messageList}
            context={this.state.activeItem}
            onChange={this.handleCheckboxChange}
          />
        </GridColumn>
      </Grid>
    );
  }
}
