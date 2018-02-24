import React from 'react';
import { withRouter } from 'react-router';
import { Input, Menu } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

class NavBar extends React.Component {
  state = {
    activeItem: 'home',
    searchInput: '',
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
    this.props.history.push(`/${name}`);
  };

  handleLogoutClick = () => {
    this.props.userStore.logoutUser();
    this.props.history.push('/');
  };

  handleSearchChange = e => this.setState({ searchInput: e.target.value });

  render() {
    const { activeItem, searchInput } = this.state;

    return (
      <Menu>
        <Menu.Item name="home" active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item
          name="communities"
          active={activeItem === 'communities'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name="trending"
          active={activeItem === 'trending'}
          onClick={this.handleItemClick}
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
          {this.props.userStore.isAuthenticated ? (
            <Menu.Item
              name="logout"
              active={activeItem === 'logout'}
              onClick={this.handleLogoutClick}
            />
          ) : (
            <Menu.Item
              name="register"
              active={activeItem === 'register'}
              onClick={this.handleItemClick}
            />
          )}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default withRouter(inject('userStore')(observer(NavBar)));
