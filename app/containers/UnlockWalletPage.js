import React, { Component } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';
import UnlockWalletForm from '../components/wallet/UnlockWalletForm';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class UnlockWalletPage extends Component {

  submit = (values) => {
    this.props.unlock(values.password);
  }

  render() {
    return (
      <div className="content-inner trans-bg no-top-padding">
        <Col xs={12} className="content-inner not-cover-footer">
          <Col md={6} sm={8} xs={10} className="top">
            <h3>Unlock Wallet</h3>
            <p className="lighter-gray-text">Welcome back! Enter your password to unlock your wallet.</p>
            {( this.props.error ? <Alert bsStyle="danger">{ this.props.error }</Alert> : "" )}
            <UnlockWalletForm onSubmit={ this.submit } {...this.props} />
          </Col>
          <Row>
            <Col xs={12} className="divider"></Col>
          </Row>
          <Col xs={12} className="bottom">
            <Link to="/wallet/import" className="btn default-button small-button">Import Wallet</Link>
            <p className="lighter-gray-text">
              You can import an existing wallet to use with the Curation Council App.
              <br/>
              However, the wallet will only hold Botcoin and Ethereum.
            </p>
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
    unlock: (password) => {
      dispatch( WalletActions.unlockWallet(password) );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnlockWalletPage);
