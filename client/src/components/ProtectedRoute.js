import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { inject } from 'mobx-react';

class ProtectedRoute extends Component {
  render() {
    const { path, userStore: { isLoggedIn, isAdmin }, component: Component } = this.props;
    return (
      <Route 
        path={path} 
        render={props => {
          if (isLoggedIn && isAdmin) {
            return <Component {...props} />;
          } else if (isLoggedIn && !isAdmin) {
            return <Redirect to='/' />;
          } else {
            return <Redirect to='/login' />;
          }
        }}
      />
    )
  }
}

export default inject('userStore')(ProtectedRoute);