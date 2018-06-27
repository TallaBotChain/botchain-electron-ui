import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';
import UnlockWalletForm from '../components/wallet/UnlockWalletForm';

class UnlockWalletPage extends Component {

  submit = (values) => {
    this.props.unlock(values.password);
  }

  render() {
    return (
      <div>
        <h1>Unlock wallet</h1>
        {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
        <UnlockWalletForm onSubmit={ this.submit } {...this.props} />
      </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    error: state.wallet.error
  };
}

const mapDispatchToProps = dispatch => {
  return {
    unlock: (password) => {
      dispatch( WalletActions.unlockWallet(password) );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnlockWalletPage);
