import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import OrderItem from './OrderItem/OrderItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  padding: 1rem;
  background-color: hsl(0, 0%, 100%);
  border: 1px solid hsl(0, 0%, 75%);
  border-radius: 3px;
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

class OrderHistory extends Component {
  componentDidMount() {
    this.props.userStore.fetchUser();
  }

  render() {
    const { userStore } = this.props;

    if (userStore.isLoggedIn) {
      return ( 
        <Wrapper>
          <Title>Order History</Title>
          {userStore.user.orderList.reverse().map(order => <OrderItem key={order.id} {...order}/>)}
        </Wrapper>
      )
    } else {
      return <Redirect to='/' />
    }
  }
}
 
export default inject('userStore')(observer(OrderHistory));