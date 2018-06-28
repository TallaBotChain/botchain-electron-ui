import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required,length,confirmation} from 'redux-form-validators'
import {inputField} from '../form/FormFields'

class ImportMnemonicForm extends Component {
  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (<form onSubmit={handleSubmit}>
      <Field name="mnemonic" type="text" component={inputField} label="Backup passphrase" placeholder="" validate={[
        required()
        ]}/>
      <Field name="password" type="password" component={inputField} label="Password" placeholder="Password" validate={[
        required(),
        length({min: 8})
        ]}/>

      <Field name="password_confirmation" type="password" component={inputField} label="Password confirmation" placeholder="Password confirmation" validate={[
        required(),
        length({min: 8}),
        confirmation({field:'password', fieldLabel: 'Password'})
        ]}/>
      <button className='btn btn-primary' type="submit">Import</button>
    </form>);
  }
}

ImportMnemonicForm = reduxForm({
  form: 'mnemonic' // a unique name for this form,
})(ImportMnemonicForm);

export default ImportMnemonicForm;
