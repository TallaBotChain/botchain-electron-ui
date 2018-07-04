import React, { Component } from 'react';
import ImportForm from '../components/wallet/ImportForm';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import * as WalletActions from '../actions/walletActions';

class ImportWalletPage extends Component {

  submit = (values) => {
    this.props.import(values);
  }

  render() {
    return (
      <div>
        <h1>Import wallet</h1>
        {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
        <ImportForm onSubmit={ this.submit }/>
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
      switch(values.import_format) {
        case "mnemonic": {
          dispatch( WalletActions.importMnemonic(values.mnemonic, values.password) );
          break;
        }
        case "private_key": {
          dispatch( WalletActions.importPrivateKey(values.private_key, values.password) );
          break;
        }
        case "json": {
          let fileReader = new FileReader();
          fileReader.readAsText(values.json[0]);
          fileReader.onload = () => {
            let json = fileReader.result;
            dispatch( WalletActions.importKeystore(json, values.password) );
          }
          break;
        }

      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletPage);
