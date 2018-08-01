import React, { Component } from 'react';
import RegistrationForm from '../components/registration/RegistrationForm';
import { connect } from 'react-redux';
import { Alert, Row, Col, Clearfix } from 'react-bootstrap';
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
        <Col xs={12} className="content-inner trans-bg">
          <Col sm={8} xs={12}>
            <h3>New User Registration</h3>
            <p>
              Welcome to the Curation Council App! In order to get started you must first sign up for an account. <strong><small>IMPORTANT:</small></strong> Make sure you use the same email that was approved by the KYC.
            </p>
          </Col>
          <Col md={6} sm={8} xs={10}>
            <RegistrationForm onSubmit={this.submit} />
          </Col>
          <Clearfix />
          <Row>
            <Col xs={12} className="divider"></Col>
          </Row>
          <Col xs={12}>
            <ImportWalletNav />
          </Col>
        </Col>

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
