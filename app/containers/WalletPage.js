// @flow
import React, { Component } from 'react';
import Wallet from '../components/wallet/Wallet.js';
import { connect } from 'react-redux';

class WalletPage extends Component {

  render() {
    return <Wallet {...this.props} />
  }
}

function mapStateToProps(state) {
    return {
      wallet: state.wallet
    };
}
  
  
export default connect(mapStateToProps, null)(WalletPage);
