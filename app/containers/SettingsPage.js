import React, { Component } from 'react';
import { connect } from 'react-redux'
import PasswordForm from '../components/settings/PasswordForm';
import ExportModal from '../components/settings/ExportModal';
import * as WalletActions from '../actions/walletActions';
import { Alert } from 'react-bootstrap';

class SettingsPage extends Component {

  constructor(props) {
    super(props);
    this.state = { show_export_modal: false };
  }

  updatePassword = (values) => {
    console.log("Change password payload: ", values);
    this.props.updatePassword(values.current_password, values.password, values.password_confirmation);
  }

  toggleExportModal = () => {
    this.setState({ show_export_modal: !this.state.show_export_modal });
    this.props.cleanError();
  }

  exportWallet = (values) => {
    console.log("Export wallet payload: ", values);
    this.props.exportWallet(values.format, values.password);
  }

  componentDidMount () {
    this.props.cleanError();
  }
 


  render() {
    return (
      <div>
        <div>
          <h1>Settings</h1>
          <div>
            <h3>1. Change Password</h3>
            {((!this.state.show_export_modal && this.props.wallet.error) ? <Alert bsStyle="danger">{this.props.wallet.error}</Alert> : "")}
            <PasswordForm onSubmit={this.updatePassword} {...this.props} />
            <h3>2. Backup</h3>
            <button className='btn btn-default' type="button" onClick={this.toggleExportModal}>Export Wallet</button>
            <ExportModal show={this.state.show_export_modal} handleClose={this.toggleExportModal} export={this.exportWallet} {...this.props} />
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
      dispatch(WalletActions.updatePassword(current_password, password, password_confirmation));
    },
    exportWallet: (format, password) => {
      return dispatch(WalletActions.exportWallet(format, password));
    },
    cleanError: () => {
      return dispatch(WalletActions.setError(null));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
