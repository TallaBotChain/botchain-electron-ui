import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required,length,confirmation} from 'redux-form-validators'
import {inputField} from '../form/FormFields'
import { Link } from 'react-router-dom';

class UnlockWalletForm extends Component {
  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (<form onSubmit={handleSubmit}>
      <Field name="password" type="password" component={inputField} placeholder="Wallet Password" validate={[
        required(),
        length({min: 8})
        ]}/>
      <button className='btn orange-button cta-button' type="submit">UNLOCK</button>
      <Link to="/wallet/import" className="pull-right gray-link">Forgot password?</Link>
    </form>);
  }
}

UnlockWalletForm = reduxForm({
  form: 'unlock_wallet' // a unique name for this form,
})(UnlockWalletForm);

export default UnlockWalletForm;
