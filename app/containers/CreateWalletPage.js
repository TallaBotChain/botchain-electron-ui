import React, { Component } from 'react';
import { Button, Well } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';
import CreateWalletForm from '../components/wallet/CreateWalletForm';

class CreateWalletPage extends Component {

  nextClick() {
    this.props.generateMnemonic();
  }

  submit = (values) => {
    console.log("create wallet values:", values);
    this.props.save(values);
  }

  render() {
    return (
      <div>
        <h1>Create wallet</h1>
        <div className={ this.props.mnemonic ? "hidden" : "" }>
          <p>Press this button to create a new wallet.</p>
          <Button bsStyle="primary" onClick={ this.nextClick.bind(this) } >Next</Button>
        </div>
        <div className={ this.props.mnemonic ? "" : "hidden" }>
          <p>Please save or remember this backup phrase.</p>
          <Well>
            { this.props.mnemonic }
          </Well>
          <p>Please create password for your wallet:</p>
          <CreateWalletForm onSubmit={ this.submit } {...this.props} />
        </div>
      </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    mnemonic: state.wallet.mnemonic
  };
}

const mapDispatchToProps = dispatch => {
  return {
    generateMnemonic: () => {
      dispatch( WalletActions.generateMnemonic() );
    },
    save: (values) => {
      dispatch( WalletActions.saveMnemonic(values.password) );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWalletPage);
