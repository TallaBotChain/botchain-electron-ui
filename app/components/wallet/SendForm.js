import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, length, numericality } from 'redux-form-validators'
import {inputField } from '../form/FormFields'
import {connect} from 'react-redux'
import KeyTools from '../../blockchain/KeyTools'

const ethAddress = value => (KeyTools.web3.utils.isAddress(value) ? undefined : 'invalid ethereum address')

class SendForm extends Component {


  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
        <form onSubmit={handleSubmit}>
          <Field name="to" type="text" component={inputField} label="To:" placeholder="0x123" validate={[required(), ethAddress]}/>
          <Field name="amount" type="text" component={inputField} label="Value:" placeholder="1.0" validate={[required(), numericality({ '>': 0, '<=': this.props.walletData.balance })]}/>
          <button className='btn btn-primary' type="submit">Submit</button>
        </form>
    );
  }
}

SendForm = reduxForm({
  form: 'eth_transfer', // a unique name for this form,
})(SendForm);

export default SendForm;
