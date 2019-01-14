import React, { Component } from 'react';
import { connect } from 'react-redux'
import PasswordForm from '../components/settings/PasswordForm';
import ExportForm from '../components/settings/ExportForm';
import NetworkForm from '../components/settings/NetworkForm';
import * as WalletActions from '../actions/walletActions';
import { Row, Col, Alert, Clearfix } from 'react-bootstrap';

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

  changeNetwork = (values) => {
    console.log("Changing network to: ", values.network);
    this.props.changeNetwork(values.network);
  }

  componentDidMount () {
    this.props.cleanError();
  }

  render() {
    return (
      <div>
        <Col xs={12} className="content-inner black-bg no-top-padding">
          <Row>
            <Col xs={12} className="content-inner lighter-gray-bg not-cover-footer">
              <div className="top">
                <Col md={6} sm={8} xs={7}>
                  <h3>Change Password</h3>
                  {(this.props.wallet.error ? <Alert bsStyle="danger">{this.props.wallet.error}</Alert> : "")}
                </Col>
                <Clearfix />
                <PasswordForm onSubmit={this.updatePassword} {...this.props} />
              </div>
              <Row>
                <Col xs={12} className="divider"></Col>
              </Row>
              <div className="bottom">
                <Col md={6} sm={8} xs={7}>
                  <h3>Export Wallet</h3>
                  <p>Backup your wallet using one of the options below.</p>
                  {(this.props.wallet.error ? <Alert bsStyle="danger">{this.props.wallet.error}</Alert> : "")}
                </Col>
                <Clearfix />
                <ExportForm onSubmit={this.exportWallet} {...this.props}  />
                <Clearfix />
              </div>
              <Row>
                <Col xs={12} className="divider"></Col>
              </Row>
              <div className="bottom">
                <Col md={8} sm={8} xs={7}>
                  <h3>Ethereum Network</h3>
                  <p>Change your Ethereum Network using one of the options below.<br/>
                    Note: Changing network requires you to enter your wallet password again.</p>
                </Col>
                <Clearfix />
                <NetworkForm onSubmit={this.changeNetwork} {...this.props} />
                <Clearfix />
              </div>
            </Col>
          </Row>
        </Col>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    wallet: state.wallet,
    initialValues: { network: state.wallet.network }
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
    },
    changeNetwork: (network) => {
      return dispatch(WalletActions.changeNetwork(network));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
