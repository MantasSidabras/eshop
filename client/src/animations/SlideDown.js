import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import anime from 'animejs';

class SlideDown extends Component {
  static defaultProps = {
    enterDuration: 250,
    exitDuration: 150
  }

  enterAnimation = el => {
    const height = el.offsetHeight;
    el.style.maxHeight = '0';
    el.style.overflow = 'hidden';

    anime({
      targets: el,
      maxHeight: height,
      marginBottom: 20,
      duration: this.props.enterDuration,
      easing: 'easeOutQuad'
    })
  }

  exitAnimation = el => {
    anime({
      targets: el,
      maxHeight: 0,
      marginBottom: 0,
      duration: this.props.exitDuration,
      easing: 'easeInQuad'
    })
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

export default SlideDown;