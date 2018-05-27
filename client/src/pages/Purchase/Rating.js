import React, { Component } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: hsl(110, 50%, 97%);
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`

const Stars = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;
`

const StarWrapper = styled.i`
  padding: 0 5px;
  cursor: pointer;
`

const Rate = styled.button`
  padding: 7px 16px;
  margin-top: 10px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  border-radius: 3px;
  box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.2);
  cursor: pointer;
  transition: 0.2s ease-in-out;
  background: hsl(110, 50%, 85%);
  border: 1px solid hsl(110, 30%, 60%);

  &:hover {
    background: hsl(110, 50%, 80%);
  }

  &:active {
    background: hsl(110, 45%, 75%);
    transform: scale(0.98);
  }
`

class Star extends Component {
  state = { 
    active: false
  }

  componentWillReceiveProps({ pos, rating }) {
    if (pos <= rating) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
  }

  onMouseEnter = () => {
    this.props.onRatingChange(this.props.pos);
  }

  onMouseLeave = () => {
    this.props.onRatingChange(this.props.prevRating);
  }

  onClick= e => {
    e.stopPropagation();
    this.props.onClick(this.props.pos);
  }

  render() { 
    const { active } = this.state;
    return (
      <StarWrapper 
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        style={active ? { color: '#ffb400'} : { color: ''}} 
        className="fas fa-star fa-lg"
      />
    )
  }
}
 

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: props.value || 5,
      prevRating: props.value || 5,
    }
  }

  handleClick = rating => {
    this.setState(state => ({ rating, prevRating: state.rating}))
    this.props.onChange(rating);
  }

  handleRatingChange = rating => {
    this.setState({ rating });
  }
  
  render() { 
    const { rating, prevRating } = this.state;

    return ( 
      <Wrapper>
        <div style={{ padding: '10px 0', textAlign: 'center' }}>Please rate your shopping experience!</div>
        <Stars>
          {[1, 2, 3, 4, 5].map(pos => 
            <Star 
              onClick={this.handleClick}
              onRatingChange={this.handleRatingChange}
              rating={rating} 
              prevRating={prevRating}
              key={pos} 
              pos={pos} 
            />)
          }
        </Stars>
        <Rate onClick={this.props.onRate}><i className="fas fa-check"></i> Rate</Rate>
      </Wrapper>
     )
  }
}
 
export default Rating;