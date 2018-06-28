import React, { Component } from 'react';
import ImportMnemonicForm from '../components/wallet/ImportMnemonicForm';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';

class ImportMnemonicPage extends Component {

  submit = (values) => {
    this.props.import(values);
  }

  render() {
    return (
      <div>
        <h1>Import mnemonic</h1>
        {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
        <ImportMnemonicForm onSubmit={ this.submit } />
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
    import: (values) => {
      dispatch( WalletActions.importMnemonic(values.mnemonic, values.password) );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportMnemonicPage);
