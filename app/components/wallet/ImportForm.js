import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required,length,confirmation} from 'redux-form-validators'
import {inputField, fileField, radioField} from '../form/FormFields'
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { FormGroup } from 'react-bootstrap';

class ImportForm extends Component {
  render() {
    const {handleSubmit, pristine, reset, submitting, importFormat} = this.props;
    return (<form onSubmit={handleSubmit}>
    <FormGroup>
      <Field name="import_format" type="radio" component={radioField} value="private_key" label="Private key" />
      <Field name="import_format" type="radio" component={radioField} value="mnemonic" label="Backup passphrase" />
      <Field name="import_format" type="radio" component={radioField} value="json" label="JSON file" />
    </FormGroup>

      {(importFormat=="private_key") && <Field name="private_key" type="text" component={inputField} label="Private key" placeholder="" validate={[
        required()
        ]}/>
      }

      {(importFormat=="mnemonic") && <Field name="mnemonic" type="text" component={inputField} label="Backup passphrase" placeholder="" validate={[
        required()
        ]}/>
      }

      {(importFormat=="json") && <Field name="json" type="file" component={fileField} label="JSON file" placeholder="" validate={[
        required()
        ]}/>
      }

      {(importFormat) && (<div>
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

      </div>)}
    </form>);
  }
}

ImportForm = reduxForm({
  form: 'import' // a unique name for this form,
})(ImportForm);

const selector = formValueSelector('import') // <-- same as form name

ImportForm = connect(
  state => {
    const importFormat = selector(state, 'import_format')
    return { importFormat };
  }
)(ImportForm);

export default ImportForm;
