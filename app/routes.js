/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import WalletRoute from './components/WalletRoute';

import VotingPage from './containers/VotingPage';
import SettingsPage from './containers/SettingsPage';
import WalletPage from './containers/WalletPage';
import NoWalletPage from './containers/NoWalletPage';
import CreateWalletPage from './containers/CreateWalletPage';
import ImportWalletPage from './containers/ImportWalletPage';


export default () => (
  <App>
    <Switch>
      <WalletRoute exact path="/voting" component={VotingPage} />
      <Route exact path="/" component={NoWalletPage} />
      <Route exact path="/wallet/new" component={CreateWalletPage} />
      <Route exact path="/wallet/import" component={ImportWalletPage} />
      <WalletRoute path="/settings" component={SettingsPage} />
      <WalletRoute path="/wallet" component={WalletPage} />
    </Switch>
  </App>
);
