// @flow
import React, { Component } from 'react';
import WalletEthereum from '../components/wallet/WalletEthereum';
import * as EthereumActions from '../actions/ethereumActions';
import { connect } from 'react-redux';

class WalletEthereumPage extends Component {

  componentDidMount () {
    this.props.getBalance()
    this.props.getTransactionList()
  }

  render() {
    return (
      <WalletEthereum {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
    return {
      usdExchangeRate: state.ethereum.usdExchangeRate,
      walletData: state.ethereum,
    };
}

const mapDispatchToProps = dispatch => {
  return {
    getBalance: () => {
      dispatch( EthereumActions.getBalance() );
    },
    transfer: (to, amount) => {
      dispatch(EthereumActions.transfer(to, amount));
    },
    getTransactionList: () => {
      dispatch(EthereumActions.getTransactionList());
    }
  }
}
  
  
export default connect(mapStateToProps, mapDispatchToProps)(WalletEthereumPage);
