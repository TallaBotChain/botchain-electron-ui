// @flow
import React, { Component } from 'react';
import WalletBotcoin from '../components/wallet/WalletBotcoin';
import * as BotcoinActions from '../actions/botcoinActions';
import * as CurationCouncilActions from '../actions/curationCouncilActions';
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
      walletData: state.botcoin,
      curationCouncil: state.curationCouncil
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
      dispatch(BotcoinActions.getTransactionList());
    }
  }
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(WalletBotcoinPage);
