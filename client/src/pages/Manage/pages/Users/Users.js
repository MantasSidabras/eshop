import React, { Component } from 'react';
import styled from 'styled-components';

import Context from 'MyContext';
import UserItem from './UserItem/UserItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  margin-bottom: 20px;
  color: hsla(0, 0%, 0%, 0.85);
  font-size: 1.1rem;
`;

const Search = styled.input.attrs({
  type: "text", 
  placeholder: "Search..."
})`

  width: 100%;
  max-width: 400px;
  padding: 5px;
  padding-left: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-family: 'Roboto', sans-serif;
  color: hsla(0, 0%, 0%, 0.75);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 15px;
  outline: none;
  transition: all 0.2s ease-in-out;

  &:focus {
    border-radius: 15px;
    box-shadow: 0 0 0 1px #4D90FE;
  }
`

class Users extends Component {
  state = {
    searchQuery: ''
  }

  handleSearch = e => this.setState({ searchQuery: e.target.value});

  filterUsers = user => user.email.toLowerCase().includes(this.state.searchQuery.toLowerCase());

  render() {
    return ( 
      <Context.Consumer>
        {({ users, fetchAllUsers }) => 
          <Wrapper>
            <Title>Users</Title>
            <Search onChange={this.handleSearch} />
            {users.filter(this.filterUsers).map(user => <UserItem key={user.id} {...user} fetchAllUsers={fetchAllUsers} />)}
          </Wrapper>
        }
      </Context.Consumer>  
    )
  }
}

export default Users;
