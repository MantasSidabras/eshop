import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import format from 'date-fns/format';

import UserApi from 'api/UserApi';
import FadeIn from 'animations/FadeIn';

const Wrapper = styled.div`
  width: 100%;

  &:last-child {
    border-bottom: 1px solid hsl(0, 0%, 85%);
  }
`

const Order = styled.div`
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

  &:hover {
    background: hsl(0, 0%, 100%);
    transform: scale(1.01)
  }
`

const DateCreated = styled.div`
  display: flex;
  align-items: center;
`;

const Price = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 10px;
  color: hsla(0, 0%, 0%, 0.85);
`;

const Label = styled.div`
  width: 66px;
  padding: 4px 6px;
  ${props => props.sent && 'background: hsl(110, 80%, 40%);'}
  ${props => props.pending && 'background: hsl(0, 0%, 70%);'}
  color: hsla(0, 0%, 100%, 0.95);
  font-size: 0.75rem;
  text-align: center;
  ${props => props.sent && 'border: 1px solid hsl(110, 80%, 30%);'}
  ${props => props.pending && 'border: 1px solid hsl(0, 0%, 60%);'}
  border-radius: 3px;
`

class OrderItem extends Component {
  render() {
    const { dateCreated, dateCompleted, price, state } = this.props;
    return ( 
      <Wrapper>
        <Order state={state}>
          <DateCreated>{format(dateCreated, 'YYYY-MM-DD, HH:mm')}</DateCreated>
          <div>{dateCompleted}</div>
          <Price>{price.toFixed(2)}€</Price>       
          {state 
            ? <Label sent>Sent</Label>
            : <Label pending>Pending</Label>
          } 
        </Order>
      </Wrapper> 
    )
  }
}
 
export default inject('userStore')(OrderItem);