import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required, acceptance, confirmation } from 'redux-form-validators'
import { inputField, checkboxField } from '../form/FormFields';
import { connect } from 'react-redux'


class RegistrationForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="name" type="text" component={inputField} placeholder="NAME *" validate={[
          required()
        ]} />

        <Field name="email" type="email" component={inputField} placeholder="EMAIL*" validate={[
          required()
        ]} />

        <Field name="email_confirmation" type="email" component={inputField} placeholder="CONFIRM EMAIL*" validate={[
          required(),
          confirmation({ field: 'email', fieldLabel: 'Email' })
        ]} />

        <Field name="organization" type="text" component={inputField} placeholder="ORGANIZATION" />
        <Field name="tos" type="checkbox" component={checkboxField} label="I agree to the Terms and Conditions" validate={acceptance({ message: "Must accept Terms and Conditions" })} />

        <button className='btn btn-default' type="submit">Create Wallet</button>
      </form>
    );
  }
}

RegistrationForm = reduxForm({
  form: 'registration', // a unique name for this form,
})(RegistrationForm);

export default RegistrationForm;
