import React, { Component } from 'react';
import {connect} from 'react-redux'
import PasswordForm from '../components/settings/PasswordForm';
import * as WalletActions from '../actions/walletActions';
import { Alert } from 'react-bootstrap';

class SettingsPage extends Component {

  updatePassword = (values) => {
    console.log("Change password payload: ", values);
    this.props.updatePassword(values.current_password, values.password, values.password_confirmation);
  }

  render() {
    return (
      <div>
        <div>
          <h1>Settings</h1>
          {( this.props.wallet.error ? <Alert bsStyle="danger">{ this.props.wallet.error }</Alert> : "" )}
          <div>
            <h3>1. Change Password</h3>
            <PasswordForm onSubmit={this.updatePassword} {...this.props}/>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    wallet: state.wallet
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updatePassword: (current_password, password, password_confirmation) => {
      dispatch( WalletActions.updatePassword(current_password, password, password_confirmation));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SettingsPage);
