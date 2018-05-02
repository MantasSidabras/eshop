import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import anime from 'animejs';

class ScaleUp extends Component {
  static defaultProps = {
    enterDuration: 250,
    exitDuration: 150
  }

  enterAnimation = el => {
    anime({
      targets: el,
      scale: [0.9, 1],
      duration: this.props.enterDuration,
      easing: 'easeOutQuad'
    })
  }

  render() {
    const { children, enterDuration, exitDuration } = this.props;
    return (
      React.Children.map(children, child => 
        <Transition 
          timeout={{enter: enterDuration, exit: exitDuration}}
          in={true}
          appear={true}
          onEntering={this.enterAnimation}
        >
          {child}
        </Transition>
      )
    )
  }
}

export default ScaleUp;