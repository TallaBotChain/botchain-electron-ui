import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required,length,confirmation} from 'redux-form-validators'
import {inputField} from '../form/FormFields'

class ImportPrivateKeyForm extends Component {
  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (<form onSubmit={handleSubmit}>
      <Field name="private_key" type="text" component={inputField} label="Private key" placeholder="" validate={[
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

ImportPrivateKeyForm = reduxForm({
  form: 'private_key' // a unique name for this form,
})(ImportPrivateKeyForm);

export default ImportPrivateKeyForm;
