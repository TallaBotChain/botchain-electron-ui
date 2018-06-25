/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import VotingPage from './containers/VotingPage';
import SettingsPage from './containers/SettingsPage';
import WalletPage from './containers/WalletPage';
import NoWalletPage from './containers/NoWalletPage';
import CreateWalletPage from './containers/CreateWalletPage';
import ImportWalletPage from './containers/ImportWalletPage';


export default () => (
  <App>
    <Switch>
      <Route exact path="/voting" component={VotingPage} />
      <Route exact path="/" component={NoWalletPage} />
      <Route exact path="/wallet/new" component={CreateWalletPage} />
      <Route exact path="/wallet/import" component={ImportWalletPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/wallet" component={WalletPage} />
    </Switch>
  </App>
);
