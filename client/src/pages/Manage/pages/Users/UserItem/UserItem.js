import React, { Component } from 'react';
import styled from 'styled-components';

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
  height: 40px;
  background: hsl(0, 0%, 99%);
  border-top: 1px solid hsl(0, 0%, 85%);
  border-right: 1px solid hsl(0, 0%, 85%);
  border-left: 3px solid hsl(210, 60%, 60%);
  transition: all 0.2s ease-in-out;

  ${props => props.blocked && 'background: hsl(0, 70%, 97%);'}

  &:hover {
    background: hsl(0, 0%, 100%);
    ${props => props.blocked && 'background: hsl(0, 70%, 98%);'}
    transform: scale(1.01)
  }
`

const Email = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`

const Blocked = styled.div`
  padding: 4px 6px;
  background: hsl(0, 70%, 60%);
  color: hsla(0, 0%, 100%, 0.95);
  font-size: 0.75rem;
  border: 1px solid hsl(0, 30%, 50%);
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
    console.log(this.props.email, 'blocked')
    this.props.handleBlock(this.props.id);

    // TODO: send user id to backend to block
  }

  render() {
    const { email, isBlocked } = this.props;
    const { showIcons } = this.state;
    return ( 
      <Wrapper>
        <User
          onMouseOver={this.showIcons} 
          onMouseLeave={this.hideIcons}
          blocked={isBlocked}
        >
          <Email>{email}</Email>
          {isBlocked && <Blocked>BLOCKED</Blocked>}
          <div style={{ width: 30, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }}>
            <FadeIn in={showIcons} enterDuration={200} exitDuration={200}>
              {isBlocked ? <i title="Unblock" className="fas fa-check-square fa-lg" onClick={this.handleBlock} /> : <i title="Block" className="fas fa-ban fa-lg" onClick={this.handleBlock} />}
            </FadeIn>
          </div>
        </User>
      </Wrapper> 
    )
  }
}
 
export default UserItem;