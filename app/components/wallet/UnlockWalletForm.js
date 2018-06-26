import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required,length,confirmation} from 'redux-form-validators'
import {inputField} from '../form/FormFields'

class UnlockWalletForm extends Component {
  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (<form onSubmit={handleSubmit}>
      <Field name="password" type="password" component={inputField} label="Password" placeholder="Password" validate={[
        required(),
        length({min: 8})
        ]}/>
      <button className='btn btn-primary' type="submit">Unlock</button>
    </form>);
  }
}

UnlockWalletForm = reduxForm({
  form: 'unlock_wallet' // a unique name for this form,
})(UnlockWalletForm);

export default UnlockWalletForm;
