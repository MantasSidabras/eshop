import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';

import UserApi from 'api/UserApi';
import FadeIn from 'animations/FadeIn';

const Wrapper = styled.div`
  width: 100%;

  &:last-child {
    border-bottom: 1px solid hsl(0, 0%, 85%);
  }
`

const User = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  padding: 8px;
  ${'' /* height: 40px; */}
  background: hsl(0, 0%, 99%);
  border-top: 1px solid hsl(0, 0%, 85%);
  border-right: 1px solid hsl(0, 0%, 85%);
  border-left: 3px solid hsl(210, 60%, 60%);
  transition: all 0.2s ease-in-out;

  ${props => props.blocked && 'background: hsl(0, 70%, 97%);'}
  ${props => props.admin && 'background: hsl(210, 70%, 97%);'}

  &:hover {
    background: hsl(0, 0%, 100%);
    ${props => props.blocked && 'background: hsl(0, 70%, 98%);'}
    ${props => props.admin && 'background: hsl(210, 70%, 98%);'}
    transform: scale(1.01)
  }
`

const Email = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const Label = styled.div`
  width: 66px;
  padding: 4px 6px;
  ${props => props.admin && 'background: hsl(210, 70%, 60%);'}
  ${props => props.blocked && 'background: hsl(0, 70%, 60%);'}
  color: hsla(0, 0%, 100%, 0.95);
  font-size: 0.75rem;
  text-align: center;
  ${props => props.admin && 'border: 1px solid hsl(210, 40%, 50%);'}
  ${props => props.blocked && 'border: 1px solid hsl(0, 40%, 50%);'}
  border-radius: 3px;
`

class UserItem extends Component {
  state = { 
    showIcons: false
  }

  showIcons = () => {
    if(!this.state.showIcons) {
      this.setState({ showIcons: true });
    }
  }
  
  hideIcons = () => this.setState({ showIcons: false });
  
  handleBlock = () => {
    const { ...user} = this.props;
    
    user.blocked = !user.blocked;

    UserApi.update(user)
      .then(res => this.props.userStore.getAll())
      .catch(error => console.error(error));
  }

  render() {
    const { email, blocked, admin } = this.props;
    const { showIcons } = this.state;
    return ( 
      <Wrapper>
        <User
          onMouseOver={this.showIcons} 
          onMouseLeave={this.hideIcons}
          blocked={blocked}
          admin={admin}
        >
          <Email>{email}</Email>
          {admin && <Label admin>ADMIN</Label>}
          {blocked && <Label blocked>BLOCKED</Label>}
          <div style={{ width: 30, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: !admin && 'pointer' }}>
            {!admin && 
              <FadeIn in={showIcons} enterDuration={200} exitDuration={200}>
                {blocked ? <i title="Unblock" className="fas fa-check-square fa-lg" onClick={this.handleBlock} /> : <i title="Block" className="fas fa-ban fa-lg" onClick={this.handleBlock} />}
              </FadeIn>
            }
          </div>
        </User>
      </Wrapper> 
    )
  }
}
 
export default inject('userStore')(UserItem);