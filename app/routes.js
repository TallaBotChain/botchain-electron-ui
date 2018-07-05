/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import WalletRoute from './components/WalletRoute';

import VotingPage from './containers/VotingPage';
import SettingsPage from './containers/SettingsPage';
import WalletEthereumPage from './containers/WalletEthereumPage';
import WalletBotcoinPage from './containers/WalletBotcoinPage';
import NoWalletPage from './containers/NoWalletPage';
import CreateWalletPage from './containers/CreateWalletPage';
import ImportWalletPage from './containers/ImportWalletPage';
import UnlockWalletPage from './containers/UnlockWalletPage';


export default () => (
  <App>
    <Switch>
      <WalletRoute exact path="/" component={VotingPage} />
      <Route exact path="/wallet/missing" component={NoWalletPage} />
      <Route exact path="/wallet/new" component={CreateWalletPage} />
      <Route exact path="/wallet/import" component={ImportWalletPage} />
      <Route exact path="/wallet/unlock" component={UnlockWalletPage} />
      <WalletRoute path="/settings" component={SettingsPage} />
      <Route exact path='/wallet' render={() => (
        <Redirect to="/wallet/ethereum" />
      )} />
      <WalletRoute path="/wallet/ethereum" component={WalletEthereumPage} />
      <WalletRoute path="/wallet/botcoin" component={WalletBotcoinPage} />
    </Switch>
  </App>
);
