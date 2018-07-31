import React, { Component } from 'react';
import { Button, Well, Col, } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/walletActions';
import CreateWalletForm from '../components/wallet/CreateWalletForm';
import { push } from "react-router-redux";
import ImportWalletNav from '../components/wallet/ImportWalletNav';
import { Link } from 'react-router-dom';

class CreateWalletPage extends Component {

  constructor(props) {
    super(props);
    this.state = { is_saved: false };
  }

  componentDidMount() {
    if (!this.props.registration.data) {
      this.props.redirectToRegistration()
    }
    this.props.generateMnemonic();
  }


  submit = (values) => {
    console.log("create wallet values:", values);
    this.props.save(values);
    this.setState({ is_saved: true });
  }

  render() {
    return (
      <div>
        {this.state.is_saved ? (
          <div>
            <h1>Step 2 of 2: Secret Backup Phrase</h1>
            <p>Please save or remember this backup phrase. It is very important. <br /> Your will have no way to recover your wallet contents if you forget it.</p>
            <Well>
              {this.props.mnemonic}
            </Well>
            <Link to="/wallet" className="btn btn-primary">I HAVE COPIED IT SOMEWHERE SAFE</Link>
          </div>
        ) : (
            <div>
              <h1>Step 1 of 2: New Wallet Password</h1>
              <p>Create a password for your new wallet. <br /> Your secret backup phrase will be given in Step 2.</p>
              <CreateWalletForm onSubmit={this.submit} {...this.props} />
            </div>
          )}
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    mnemonic: state.wallet.mnemonic,
    registration: state.registration
  };
}

const mapDispatchToProps = dispatch => {
  return {
    generateMnemonic: () => {
      dispatch(WalletActions.generateMnemonic());
    },
    save: (values) => {
      dispatch(WalletActions.saveMnemonic(values.password));
    },
    redirectToRegistration: () => {
      dispatch(push("/registration"))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateWalletPage);
