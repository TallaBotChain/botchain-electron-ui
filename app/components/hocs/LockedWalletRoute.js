import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import keyTools from '../../blockchain/KeyTools';

//localStorage.removeItem("botcoin")


const LockedWalletRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      keyTools.walletLocked ? (
        <Component {...props} />
      ) : (
          keyTools.privateKeyPresent ? (
            <Redirect to="/wallet" />
          ) : (
              <Redirect to="/registration" />
            )
        )
    }
  />
);

export default LockedWalletRoute
