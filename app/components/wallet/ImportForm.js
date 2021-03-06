import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required,length,confirmation} from 'redux-form-validators'
import {inputField, fileField, radioField} from '../form/FormFields'
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Nav, NavItem, Col, Clearfix } from 'react-bootstrap';

class ImportForm extends Component {

  changeFormat = (format) => {
    this.props.change('import_format', format);

  }

  render() {
    const {handleSubmit, pristine, reset, submitting, importFormat} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Col md={3} sm={4} xs={5}>
          <Nav className="pills import-nav" stacked activeKey={importFormat} onSelect={this.changeFormat}>
            <NavItem eventKey={"private_key"} title="Private Key">Private Key</NavItem>
            <NavItem eventKey={"mnemonic"} title="Backup Passphrase">Backup Passphrase</NavItem>
            <NavItem eventKey={"json"} title="JSON file">JSON file</NavItem>
          </Nav>
        </Col>
        <Col md={6} sm={8} xs={7}>
          {(importFormat=="private_key") && <Field name="private_key" type="text" component={inputField} label="Private Key*" placeholder="" validate={[
            required()
            ]}/>
          }

          {(importFormat=="mnemonic") && <Field name="mnemonic" type="text" component={inputField} label="Backup Passphrase*" placeholder="" validate={[
            required()
            ]}/>
          }

          {(importFormat=="json") && <Field name="json" type="file" component={fileField} label="Choose File" placeholder="Upload JSON file" validate={[
            required()
            ]}/>
          }

          {(importFormat) && (<div>
          <Field name="password" type="password" component={inputField} label="Password*" placeholder="Password*" validate={[
            required(),
            length({min: 8})
            ]}/>

          <Field name="password_confirmation" type="password" component={inputField} label="Confirm Password*" placeholder="Confirm Password*" validate={[
            required(),
            length({min: 8}),
            confirmation({field:'password', fieldLabel: 'Password'})
            ]}/>

          <button className='btn orange-button cta-button' type="submit">IMPORT</button>
          <small className="pull-right gray required">*Required</small>

          </div>)}
        </Col>
        <Clearfix />
      </form>
    );
  }
}

ImportForm = reduxForm({
  form: 'import' // a unique name for this form,
})(ImportForm);

const selector = formValueSelector('import') // <-- same as form name

ImportForm = connect(
  state => {
    const importFormat = selector(state, 'import_format')
    return { 
      importFormat,
      initialValues: { import_format: "private_key"}
    };
  }
)(ImportForm);

export default ImportForm;
