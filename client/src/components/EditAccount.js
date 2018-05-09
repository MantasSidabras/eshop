import React, { Component } from 'react';
import styled from 'styled-components';

import UserApi from 'api/UserApi';

const Wrapper = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  width: 150px;
  text-align: left;
  background: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  outline: none;
  z-index: 999;

  div {
    padding: 8px 15px;

    &:hover {
      color: hsla(0, 0%, 0%, 0.85);
      background: hsl(0, 0%, 98%);
    }
  }
`

class EditAccount extends Component {
  handleLogout = () => {
    // TODO: implement logout
  }

  render() { 
    return ( 
      <Wrapper onClick={e => e.stopPropagation()}>
        <div>Edit Account</div>
        <div>My history</div>
        <div style={{ marginTop: 5}} onClick={this.handleLogout} >Logout</div>
      </Wrapper>
    )
  }
}
 
export default EditAccount;