import React, { Component } from 'react';
import ImportForm from '../components/wallet/ImportForm';
import { connect } from 'react-redux';
import { Row, Col, Alert, Clearfix } from 'react-bootstrap';
import * as WalletActions from '../actions/walletActions';
import { Link } from 'react-router-dom';
import CreateWalletNav from '../components/wallet/CreateWalletNav';
import keyTools from '../blockchain/KeyTools';


class ImportWalletPage extends Component {

  submit = (values) => {
    this.props.import(values);
  }

  render() {
    return (
      <div className="content-inner trans-bg no-top-padding">
        <Col xs={12} className="content-inner not-cover-footer">
          <div className="top">
            <Col md={3} sm={4} xs={5}>
              <Link to="/wallet/unlock" className="btn gray-button small-button">Cancel Import</Link>
            </Col>
            <Col md={6} sm={8} xs={7}>
              <h3>Import Wallet</h3>
              {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
            </Col>
            <Clearfix />
            <ImportForm onSubmit={ this.submit }/>
          </div>
          <Row>
            <Col xs={12} className="divider"></Col>
          </Row>
          <Col xs={12} className="bottom">
        </Col>

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
