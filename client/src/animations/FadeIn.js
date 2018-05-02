import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import anime from 'animejs';

class FadeIn extends Component {
  static defaultProps = {
    enterDuration: 250,
    exitDuration: 150
  }

  enterAnimation = el => {
    anime({
      targets: el,
      opacity: [0, 1],
      duration: this.props.enterDuration,
      easing: 'easeOutQuad'
    });
  }

  exitAnimation = el => {
    anime({
      targets: el,
      opacity: 0,
      duration: this.props.exitDuration,
      easing: 'easeInQuad'
    });
  }

  render() {
    const { in: inProp, children, enterDuration, exitDuration } = this.props;
    return (
      React.Children.map(children, child => 
        <Transition 
          timeout={{enter: enterDuration, exit: exitDuration}}
          in={inProp}
          mountOnEnter={true}
          unmountOnExit={true}
          appear={true}
          onEntering={this.enterAnimation}
          onExiting={this.exitAnimation}
        >
          {child}
        </Transition>
      )
    )
  }
}

export default FadeIn;