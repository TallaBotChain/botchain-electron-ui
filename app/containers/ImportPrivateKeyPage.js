import React, { Component } from 'react';
import ImportPrivateKeyForm from '../components/wallet/ImportPrivateKeyForm';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';

class ImportPrivateKeyPage extends Component {

  submit = (values) => {
    this.props.import(values);
  }

  render() {
    return (
      <div>
        <h1>Import private key</h1>
        {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
        <ImportPrivateKeyForm onSubmit={ this.submit } />
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
      dispatch( WalletActions.importPrivateKey(values.private_key, values.password) );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportPrivateKeyPage);
