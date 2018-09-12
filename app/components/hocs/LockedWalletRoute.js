import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import keyTools from '../../blockchain/KeyTools';

const LockedWalletRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      keyTools.walletLocked ? (
        <Component {...props} />
      ) : (
          keyTools.privateKeyPresent ? (
            <Redirect to="/" />
          ) : (
              <Redirect to="/registration" />
            )
        )
    }
  />
);

export default LockedWalletRoute
