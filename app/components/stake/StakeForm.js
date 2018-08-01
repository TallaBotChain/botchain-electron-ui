import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, numericality } from 'redux-form-validators'
import {inputField } from '../form/FormFields'

class StakeForm extends Component {

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
        <form onSubmit={handleSubmit}>
          <Field name="amount" type="text" component={inputField} label={this.props.label} placeholder="1.0" validate={[required(), numericality({ '>': 0, '<=': this.props.walletData.balance })]}/>
          <button className='btn btn-primary' type="submit">Submit</button>
        </form>
    );
  }
}

StakeForm = reduxForm({
  form: 'stake', // a unique name for this form,
})(StakeForm);

export default StakeForm;
