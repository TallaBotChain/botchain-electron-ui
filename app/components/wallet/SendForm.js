import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import { connect } from 'react-redux';
import {required, length, numericality } from 'redux-form-validators'
import {inputField } from '../form/FormFields'
import KeyTools from '../../blockchain/KeyTools'
import { Col, Row } from 'react-bootstrap';

const ethAddress = value => (KeyTools.web3.utils.isAddress(value) ? undefined : 'invalid ethereum address')

class SendForm extends Component {


  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
        <form onSubmit={handleSubmit}>
          <Field name="to" type="text" component={inputField} label="To:" placeholder="0x123" validate={[required(), ethAddress]}/>
          <Field name="amount" type="text" component={inputField} label="Value:" placeholder="1.0" validate={[required(), numericality({ '>': 0, '<=': this.props.walletData.balance })]}/>
          <Row>
            <Col xs={12}>
              <Row>
                <Col xs={2}><button className='btn btn-primary' type="submit">Submit</button></Col>
                <Col xs={8}>
                  <Row>
                    <Col xs={6}>
                      <div><small>Send {this.props.amount ? this.props.amount : 0} {this.props.walletData.currency}</small></div>
                      <div><small>Gas Fee: {this.props.walletData.transferTxEstGas} ETH</small></div>
                    </Col>
                    <Col xs={6}>
                      <div><small>{this.props.walletData.currency==="ETH" && this.props.amount ? `$${this.props.amount*this.props.usdExchangeRate}` : "$0" }</small></div>
                      <div><small>${this.props.walletData.transferTxEstGas*this.props.usdExchangeRate}</small></div>
                    </Col>
                  </Row>
                </Col>
                <Col xs={2}><button className='btn btn-default' type="submit">Cancel</button></Col>
              </Row>
            </Col>
          </Row>
        </form>
    );
  }
}

SendForm = reduxForm({
  form: 'eth_transfer', // a unique name for this form,
})(SendForm);

const selector = formValueSelector('eth_transfer') // <-- same as form name

SendForm = connect(
  state => {
    const amount = selector(state, 'amount')
    return {
      amount
    };
  }
)(SendForm);

export default SendForm;
