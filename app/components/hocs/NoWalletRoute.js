import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import keyTools from '../../blockchain/KeyTools';

//localStorage.removeItem("botcoin")


const NoWalletRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !keyTools.privateKeyPresent ? (
        <Component {...props} />
      ) : (
        <Redirect to="/wallet/unlock" />
        )
    }
  />
);

export default NoWalletRoute
