import React from 'react';
import { withRouter } from 'react-router';
import { Input, Menu, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { NavLink } from 'react-router-dom';

const menuItemStyle = {
  color: '#EEE',
};

const menuStyle = {
  background: '#4267b2',
};

const ENTER_KEY = 13;

@withRouter
@inject('authStore', 'userStore', 'postStore')
@observer
export default class NavBar extends React.Component {
  state = {
    activeItem: 'home',
    searchInput: '',
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  handleKeyDown = async ({ keyCode }) => {
    if (keyCode === ENTER_KEY) {
      await this.props.postStore.fetchAllPosts(this.state.searchInput);
    }
  };

  handleLogoutClick = () => {
    this.props.authStore.logout();
    this.props.history.push('/');
  };

  handleSearchChange = e => this.setState({ searchInput: e.target.value });

  render() {
    const { activeItem, searchInput } = this.state;

    return (
      <Menu style={menuStyle}>
        <Menu.Item
          name="home"
          as={NavLink}
          to="/"
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
          style={menuItemStyle}
        />
        <Menu.Item
          name="communities"
          as={NavLink}
          to="/communities"
          active={activeItem === 'communities'}
          onClick={this.handleItemClick}
          style={menuItemStyle}
        />
        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              icon="search"
              placeholder="Search..."
              value={searchInput}
              onChange={this.handleSearchChange}
              onKeyDown={this.handleKeyDown}
            />
          </Menu.Item>
          {this.props.authStore.isAuthenticated ? (
            <React.Fragment>
              <Menu.Item
                name="inbox"
                as={NavLink}
                to="/inbox"
                active={activeItem === 'inbox'}
                style={menuItemStyle}
              >
                <Icon name="inbox" />
              </Menu.Item>
              <Menu.Item
                content={`Hi, ${
                  this.props.userStore.user ? this.props.userStore.user.username : ''
                }!`}
                style={menuItemStyle}
              />
              <Menu.Item
                name="logout"
                active={activeItem === 'logout'}
                onClick={this.handleLogoutClick}
                style={menuItemStyle}
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Menu.Item
                name="register"
                as={NavLink}
                to="/register"
                active={activeItem === 'register'}
                onClick={this.handleItemClick}
                style={menuItemStyle}
              />
              <Menu.Item
                name="login"
                as={NavLink}
                to="/login"
                active={activeItem === 'login'}
                onClick={this.handleItemClick}
                style={menuItemStyle}
              />
            </React.Fragment>
          )}
        </Menu.Menu>
      </Menu>
    );
  }
}
