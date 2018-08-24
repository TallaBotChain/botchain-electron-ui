// @flow
import React, { Component } from 'react';
import WalletBotcoin from '../components/wallet/WalletBotcoin';
import * as BotcoinActions from '../actions/botcoinActions';
import * as CurationCouncilActions from '../actions/curationCouncilActions';
import * as HistoryActions from '../actions/historyActions';
import { connect } from 'react-redux';

class WalletBotcoinPage extends Component {

  componentDidMount () {
    this.props.getBalance()
    this.props.getTransactionList()
  }

  render() {
    return (
      <WalletBotcoin {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
    return {
      usdExchangeRate: state.ethereum.usdExchangeRate,
      walletData: state.botcoin,
      curationCouncil: state.curationCouncil,
      history: state.history
    };
}

const mapDispatchToProps = dispatch => {
  return {
    getBalance: () => {
      dispatch( BotcoinActions.getBalance() );
    },
    transfer: (to, amount) => {
      dispatch(BotcoinActions.transfer(to, amount));
    },
    getTransactionList: () => {
      dispatch(HistoryActions.getBotcoinHistory());
    },
    transferEstGas: (to, amount) => {
      dispatch(BotcoinActions.transferEstGas(to, amount));
    },
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WalletBotcoinPage);
