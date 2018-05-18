import React, { Component } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import OrderItem from './OrderItem/OrderItem';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 34px;
  margin-bottom: 20px;
  color: hsla(0, 0%, 0%, 0.85);
  font-size: 1.1rem;
`

class Orders extends Component {
  state = {

  }

  componentDidMount() {
    this.props.orderStore.getAll();
  }

  render() {
    const { orders } = this.props.orderStore;
    return (
      <Wrapper>
        <Title>Order History</Title>
        {orders.reverse().map(order => <OrderItem key={order.id} {...order} />)}
        {orders.length === 0 && <div style={{ color: 'hsla(0, 0%, 0%, 0.6)'}}>No orders</div>}
      </Wrapper>
    );
  }
}

export default inject('orderStore')(observer(Orders));
