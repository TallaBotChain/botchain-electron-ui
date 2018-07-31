import React, { Component } from 'react';
import ImportForm from '../components/wallet/ImportForm';
import { connect } from 'react-redux';
import { Col, Alert } from 'react-bootstrap';
import * as WalletActions from '../actions/walletActions';
import { Link } from 'react-router-dom';

class ImportWalletPage extends Component {

  submit = (values) => {
    this.props.import(values);
  }

  render() {
    return (
      <div>
        <Col xs={12} className="content-inner trans-bg top50">
        </Col>
        <Col xs={12} className="divider">
        </Col>
        <Col xs={12} className="content-inner trans-bg bottom50">
          <Col md={3} sm={4} xs={5}>
            <Link to="/wallet/unlock" className="btn gray-button small-button">Cancel Import</Link>
          </Col>
          <Col md={9} sm={8} xs={7}>
            <h3>Import Wallet</h3>
          </Col>
          {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
          <ImportForm onSubmit={ this.submit }/>
        </Col>
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
