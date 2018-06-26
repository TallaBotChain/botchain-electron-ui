import React from 'react';
import { Route, Redirect } from 'react-router-dom';


const WalletRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      //TODO use KeyTools for  
      false ? (
        <Component {...props} />
      ) : (
          <Redirect to="/" />
        )
    }
  />
);

export default WalletRoute