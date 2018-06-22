/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import VotingPage from './containers/VotingPage';
import SettingsPage from './containers/SettingsPage';
import WalletPage from './containers/WalletPage';


export default () => (
  <App>
    <Switch>
      <Route exact path="/" component={VotingPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/wallet" component={WalletPage} />
    </Switch>
  </App>
);
