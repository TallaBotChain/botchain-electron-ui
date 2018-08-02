import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, length, confirmation} from 'redux-form-validators'
import { inputField } from '../form/FormFields';
import {connect} from 'react-redux'
import { Col } from 'react-bootstrap';

class PasswordForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Col md={6} sm={8} xs={7}>
          <Field name="current_password" type="password" component={inputField} label="Current Password"  placeholder="Current Password" validate={[
            required(),
            length({min: 8})
          ]}/>

          <Field name="password" type="password" component={inputField} label="New Password" placeholder="New Password" validate={[
            required(),
            length({min: 8})
          ]}/>

          <Field name="password_confirmation" type="password" component={inputField} label="Confirm Password" placeholder="Confirm Password" validate={[
            required(),
            length({min: 8}),
            confirmation({ field: 'password', fieldLabel: 'Password' })
          ]}/>
        <button className='btn btn-default' type="submit">Update Password</button>
        </Col>
      </form>
    );
  }
}

PasswordForm = reduxForm({
  form: 'password', // a unique name for this form,
})(PasswordForm);

export default PasswordForm;
