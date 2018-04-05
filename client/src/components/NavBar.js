import React from 'react';
import { withRouter } from 'react-router';
import { Input, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

const menuItemStyle = {
  color: '#EEE',
};

const menuStyle = {
  background: '#4267b2',
};

@withRouter
@inject('authStore', 'userStore')
@observer
export default class NavBar extends React.Component {
  state = {
    activeItem: 'home',
    searchInput: '',
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.props.history.push(`/${name}`);
  };

  handleLogoutClick = () => {
    this.props.authStore.logoutUser();
    this.props.history.push('/');
  };

  handleSearchChange = e => this.setState({ searchInput: e.target.value });

  render() {
    const { activeItem, searchInput } = this.state;

    return (
      <Menu style={menuStyle}>
        <Menu.Item
          name="home"
          active={activeItem === 'home'}
          onClick={this.handleItemClick}
          style={menuItemStyle}
        />
        <Menu.Item
          name="communities"
          active={activeItem === 'communities'}
          onClick={this.handleItemClick}
          style={menuItemStyle}
        />
        <Menu.Item
          name="trending"
          active={activeItem === 'trending'}
          onClick={this.handleItemClick}
          style={menuItemStyle}
        />
        <Menu.Menu position="right">
          <Menu.Item>
            <Input
              onKeyDown={this.handleKeyDown}
              icon="search"
              placeholder="Search..."
              value={searchInput}
              onChange={this.handleSearchChange}
            />
          </Menu.Item>
          {this.props.authStore.isAuthenticated ? (
            <React.Fragment>
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
                active={activeItem === 'register'}
                onClick={this.handleItemClick}
                style={menuItemStyle}
              />
              <Menu.Item
                name="login"
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
