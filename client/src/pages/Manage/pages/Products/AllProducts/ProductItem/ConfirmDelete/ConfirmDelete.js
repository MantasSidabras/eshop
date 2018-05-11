import React, {Component} from 'react';
import styled from 'styled-components';

import ScaleUp from 'animations/ScaleUp';

const Wrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: hsla(0, 0%, 0%, 0.6);
  z-index: 999;
`

const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  background: hsl(0, 0%, 100%);
  border-radius: 3px;

  @media (min-width: 700px) {
    margin-top: -20vh;
  }
`

const Buttons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  user-select: none;
`

const Button = styled.button`
  padding: 7px 14px;
  width: 80px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
`
const Delete = Button.extend`
  margin-right: 10px;
  color: hsla(0, 0%, 100%, 0.9);
  background: hsl(0, 70%, 65%);
  border: 1px solid hsl(0, 30%, 50%);
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  transition: all 0.2s ease-in-out;

  &:hover {
    background: hsl(0, 65%, 60%);
  }

  &:active {
    background: hsl(0, 55%, 55%);
    transform: scale(0.98);
  }
`

const Cancel = Button.extend`
  background: none;
  border: none;
  box-shadow: none;
`

class ConfirmDelete extends Component {
  render () {
    const { name, onDelete, onCancel } = this.props;
    return (
      <Wrapper onClick={onCancel}>
        <ScaleUp>
          <Message onClick={e => e.stopPropagation()}>
            Are you sure you want to delete {name}?
            <Buttons>
              <Delete onClick={onDelete}>Delete</Delete>
              <Cancel onClick={onCancel}>Cancel</Cancel>
            </Buttons>
          </Message>
        </ScaleUp>
      </Wrapper>
    )
  }
};

export default ConfirmDelete;