import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import keyTools from '../../blockchain/KeyTools';

const UnlockedWalletRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      keyTools.walletReady  ? (
        <Component {...props} />
      ) : (
          <Redirect to="/wallet/unlock" />
        )
    }
  />
);

export default UnlockedWalletRoute
