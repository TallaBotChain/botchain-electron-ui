/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import App from './containers/App';
import UnlockedWalletRoute from './components/hocs/UnlockedWalletRoute';
import LockedWalletRoute from './components/hocs/LockedWalletRoute';
import NoWalletRoute from './components/hocs/NoWalletRoute';

import VotingPage from './containers/VotingPage';
import SettingsPage from './containers/SettingsPage';
import WalletEthereumPage from './containers/WalletEthereumPage';
import WalletBotcoinPage from './containers/WalletBotcoinPage';
import NoWalletPage from './containers/NoWalletPage';
import CreateWalletPage from './containers/CreateWalletPage';
import ImportWalletPage from './containers/ImportWalletPage';
import UnlockWalletPage from './containers/UnlockWalletPage';
import RegistrationPage from './containers/RegistrationPage';


export default () => (
  <App>
    <Switch>
      <UnlockedWalletRoute exact path="/" component={VotingPage} />
      <NoWalletRoute exact path="/wallet/new" component={CreateWalletPage} />
      <Route exact path="/wallet/import" component={ImportWalletPage} />
      <LockedWalletRoute exact path="/wallet/unlock" component={UnlockWalletPage} />
      <UnlockedWalletRoute path="/settings" component={SettingsPage} />
      <Route exact path='/wallet' render={() => (
        <Redirect to="/wallet/ethereum" />
      )} />
      <UnlockedWalletRoute path="/wallet/ethereum" component={WalletEthereumPage} />
      <UnlockedWalletRoute path="/wallet/botcoin" component={WalletBotcoinPage} />
      <NoWalletRoute exact path="/registration" component={RegistrationPage} />
    </Switch>
  </App>
);
