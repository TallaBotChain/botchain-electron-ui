import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, length } from 'redux-form-validators'
import { inputField, radioField } from '../form/FormFields';
import { connect } from 'react-redux'
import { Col, Clearfix } from 'react-bootstrap';

class ExportForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit} >
        <Col md={6} sm={8} xs={7}>
          <Field name="password" type="password" component={inputField} placeholder="Enter your password*" label="Enter your password*" validate={[
            required(),
            length({ min: 8 })
          ]} />
          <div className="radio pull-left">
            <label>
              <Field
                name="format"
                component="input"
                type="radio"
                value="json"
              />
              <span>JSON</span>
            </label>
          </div>
          <div className="radio pull-left">
            <label>
              <Field
                name="format"
                component="input"
                type="radio"
                value="private_key"
              />
              <span>Private Key</span>
            </label>
          </div>
          <Clearfix />
          <button className='btn orange-button cta-button' type="submit">EXPORT WALLET</button>
        </Col>
      </form>
    );
  }
}

ExportForm = reduxForm({
  form: 'export', // a unique name for this form
  initialValues: {format: "json"}
})(ExportForm);

export default ExportForm;
