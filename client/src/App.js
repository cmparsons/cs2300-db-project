import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    users: [],
    newUser: '',
  };

  async componentDidMount() {
    const response = await axios.get('/users/');
    console.log(response);
    const users = response.data;
    this.onMount(users);
  }

  onMount = (users) => {
    this.setState({ users });
  };

  handleButtonClick = async () => {
    const { newUser, users } = this.state;

    const response = await axios.post('/users/', {
      username: newUser,
    });

    if (response.status === 200) {
      this.setState({ users: [...users, response.data], newUser: '' });
    }
  };

  render() {
    const { newUser, users } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Enter name"
          onChange={e => this.setState({ newUser: e.target.value })}
          value={newUser}
        />
        <button onClick={this.handleButtonClick}>Submit</button>
        <ul>{users && users.map(user => <li key={user.id}>{user.name}</li>)}</ul>
      </div>
    );
  }
}

export default App;
