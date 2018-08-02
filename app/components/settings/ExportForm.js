import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, length } from 'redux-form-validators'
import { inputField, radioField } from '../form/FormFields';
import { connect } from 'react-redux'
import { Col } from 'react-bootstrap';

class ExportForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit} >
        <Col md={6} sm={8} xs={7}>
        <Field name="password" type="password" component={inputField} placeholder="Password" label="Password" validate={[
          required(),
          length({ min: 8 })
        ]} />
        <div>Options:</div>
        <div className="radio">
          <label>
            <Field
              name="format"
              component="input"
              type="radio"
              value="json"
            />{' '}
            JSON
          </label>
        </div>
        <div className="radio">
          <label>
            <Field
              name="format"
              component="input"
              type="radio"
              value="private_key"
            />{' '}
            Private Key
          </label>
        </div>
        <button className='btn btn-default' type="submit">Export Wallet</button>
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
