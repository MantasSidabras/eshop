import React, { Component } from 'react';
import styled from 'styled-components';
import { inject } from 'mobx-react';
import format from 'date-fns/format';

import OrderApi from 'api/OrderApi';
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

const Id = styled.div`
  display: flex;
  align-items: center;
  width: 25px;
  margin-right: 10px;
  font-weight:bold;
`;

const DateCreated = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const Name = styled.div`
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
  state = {
    showIcon: false
  }

  showIcon = () => {
    if(!this.state.showIcons) {
      this.setState({ showIcon: true });
    }
  }
  
  hideIcon = () => this.setState({ showIcon: false });

  handleSent = () => {
    const { ...order} = this.props;
    
    order.state = true;

    OrderApi.update(order)
      .then(res => this.props.orderStore.getAll())
      .catch(error => console.error(error));
  }

  render() {
    const { id, dateCreated, dateCompleted, fullName, price, state } = this.props;
    const { showIcon } = this.state;
    return ( 
      <Wrapper>
        <Order 
          onMouseOver={this.showIcon} 
          onMouseLeave={this.hideIcon}
        >
          <Id>{id}</Id>
          <DateCreated>{format(dateCreated, 'YYYY-MM-DD, HH:mm')}</DateCreated>
          <Name>{fullName}</Name>
          <Price>{price.toFixed(2)}€</Price>       
          {state 
            ? <Label sent>Sent</Label>
            : <Label pending>Pending</Label>
          } 
          <div style={{ width: 30, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', cursor: 'pointer' }}>
            {!state && 
              <FadeIn in={showIcon} enterDuration={200} exitDuration={200}>
                <i title="Mark as sent" className="fas fa-check-square fa-lg" onClick={this.handleSent} /> 
              </FadeIn>
            }
          </div>
        </Order>
      </Wrapper> 
    )
  }
}
 
export default inject('orderStore')(OrderItem);