import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import keyTools from '../blockchain/KeyTools';


const WalletRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      keyTools.walletReady  ? (
        <Component {...props} />
      ) : (
          keyTools.privateKeyPresent ? (
          <Redirect to="/wallet/unlock" />
          ) : (
          <Redirect to="/wallet/missing" />
          )
        )
    }
  />
);

export default WalletRoute
