import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, length } from 'redux-form-validators'
import { inputField, radioField } from '../form/FormFields';
import { connect } from 'react-redux'
import { Col, Clearfix } from 'react-bootstrap';

class NetworkForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit} >
        <Col md={6} sm={8} xs={7}>
          <div className="radio pull-left">
            <label>
              <Field
                name="network"
                component="input"
                type="radio"
                value="kovan"
              />
              <span>Kovan Test Network</span>
            </label>
          </div>
          <div className="radio pull-left">
            <label>
              <Field
                name="network"
                component="input"
                type="radio"
                value="mainnet"
              />
              <span>Mainnet Ethereum Network</span>
            </label>
          </div>
          <Clearfix />
          <button className='btn orange-button cta-button' type="submit">CHANGE NETWORK</button>
        </Col>
      </form>
    );
  }
}

NetworkForm = reduxForm({
  form: 'network' // a unique name for this form
})(NetworkForm);

export default NetworkForm;
