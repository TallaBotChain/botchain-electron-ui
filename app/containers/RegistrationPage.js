import React, { Component } from 'react';
import RegistrationForm from '../components/registration/RegistrationForm';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import * as RegistrationActions from '../actions/registrationActions';
import ImportWalletNav from '../components/wallet/ImportWalletNav';

class RegistrationPage extends Component {

  componentDidMount () {
    if (this.props.registration.data) {
      this.props.redirectNext()
    }
  }

  submit = (values) => {
    this.props.saveRegistration(values);
  }

  render() {
    return (
      <div>
        <h1>New User Registration</h1>
        <p>Welcome to the Curation Council App! In order to get started you must first sign up for an account. <br/> <strong>IMPORTANT:</strong> Make sure you use the same email that was approved by the KYC.</p>
        <RegistrationForm onSubmit={this.submit} />
        <hr/>
        <ImportWalletNav />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    registration: state.registration
  };
}

const mapDispatchToProps = dispatch => {
  return {
    saveRegistration: (values) => {
      dispatch(RegistrationActions.saveRegistration(values))
    },
    redirectNext: () => {
      dispatch(RegistrationActions.redirectNext())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationPage);
