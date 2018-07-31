import React, { Component } from 'react';
import { Button, Well, Col, } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';
import CreateWalletForm from '../components/wallet/CreateWalletForm';
import { Link } from 'react-router-dom';

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
        <Col xs={12} className="content-inner trans-bg top50">
          <div className={ this.props.mnemonic ? "hidden" : "" }>
            <Col xs={12}>
              <Button className="default-button small-button" onClick={ this.nextClick.bind(this) } >Create New Wallet</Button>
              <p>
                Create a new wallet to use with the Curation Council App.
                <br/>
                The wallet will hold Botcoin and Ethereum.
              </p>
            </Col>
          </div>
          <div className={ this.props.mnemonic ? "" : "hidden" }>
            <Col md={3} sm={4} xs={5}>
              <Link to="" className="btn gray-button small-button">Cancel New Wallet</Link>
            </Col>
            <Col md={6} sm={8} xs={7}>
              <h3>Step 1 of 2: New Wallet Password</h3>
              <p>
                Create a password for your new wallet.<br/>
                Your secret backup phrase will be given in Step 2.
              </p>
              <CreateWalletForm onSubmit={ this.submit } {...this.props} />
            </Col>
            <Col md={9} sm={8} xs={7} className="pull-right">
              <h3>Step 2 of 2: Secret Backup Phrase</h3>
              <p>
                Please save or remember this backup phrase. It is very important.<br/>
 You will have no way to recover your wallet contents if you forget it.
              </p>
              <Well>
                { this.props.mnemonic }
              </Well>
              <button className='btn orange-button cta-button'>I HAVE COPIED IT SOMEWHERE SAFE</button>
            </Col>
          </div>
        </Col>
        <Col xs={12} className="divider">
        </Col>
        <Col xs={12} className="content-inner trans-bg bottom50">
          <div className={ this.props.mnemonic ? "hidden" : "" }>
            <Col xs={12}>
              <Link to="/wallet/import" className="btn default-button small-button">Import Wallet</Link>
              <p className="lighter-gray-text">
                You can import an existing wallet to use with the Curation Council App.
                <br/>
                However, the wallet will only hold Botcoin and Ethereum.
              </p>
            </Col>
          </div>
        </Col>
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
