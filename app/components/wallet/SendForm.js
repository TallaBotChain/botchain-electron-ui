import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import { connect } from 'react-redux';
import {required, length, numericality } from 'redux-form-validators'
import {inputField } from '../form/FormFields'
import KeyTools from '../../blockchain/KeyTools'
import { Col, Row } from 'react-bootstrap';
import NotEnoughEth from './NotEnoughEth'

const ethAddress = value => (KeyTools.web3.utils.isAddress(value) ? undefined : 'invalid ethereum address')

class SendForm extends Component {

  hasEnoughEth = () => {
    return this.props.walletData.balance > this.props.walletData.transferTxEstGas
  }

  availableBalance = () => {
    if (this.props.walletData.currency === "ETH") {
      return this.props.walletData.balance > 0 ? (this.props.walletData.balance - this.props.walletData.transferTxEstGas) : this.props.walletData.balance
    } else {
      return this.props.walletData.balance
    }
  }


  render() {
    const {handleSubmit, pristine, reset, submitting, disabled} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          {!this.hasEnoughEth() && (
            <Col xs={10} xsOffset={1}>
              <NotEnoughEth />
            </Col>
          )}
          <Col xs={10} xsOffset={1}>
            <span className="form-icon arrow-icon"></span>
            <Field name="to" type="text" component={inputField} label="To:" placeholder={this.props.walletData.currency==="ETH" ? "Send to Ethereum address" : "Send to Botcoin address"} validate={[required(), ethAddress]}/>
          </Col>
          <Col xs={10} xsOffset={1}>
            <span className="form-icon currency-icon"></span>
            <Field name="amount" type="text" component={inputField} label="Amount" placeholder="Amount" validate={[required(), numericality({ '>': 0, '<=': this.availableBalance(), msg: {lessThanOrEqualTo: "is exceed the balance"}}) ]}/>
            <span className={`currency ${this.props.walletData.currency.toLowerCase()}`}>{this.props.walletData.currency}</span>
          </Col>
        </Row>
        <Row className="form-footer">
          <Col xs={12}>
            <Col xs={3}>
              <button className='btn orange-button small-button width-100' type="submit" disabled={pristine || submitting || !this.hasEnoughEth()}>SUBMIT</button>
            </Col>
            <Col xs={6}>
              <Row>
                <Row>
                  <Col xs={8} className="gray-text">
                    <div><small><strong>Send {this.props.amount ? this.props.amount : 0} <small>{this.props.walletData.currency}</small></strong></small></div>
                    <div><small><small>Gas Fee: {this.props.walletData.transferTxEstGas} <small>ETH</small></small></small></div>
                  </Col>
                  <Col xs={4} className="gray-text right-small">
                    <div><small><small><strong>{this.props.walletData.currency==="ETH" && this.props.amount ? `$${(this.props.amount*this.props.usdExchangeRate).toFixed(4)}` : "$0" }</strong></small></small></div>
                    <div><small><small><small>${(this.props.walletData.transferTxEstGas*this.props.usdExchangeRate).toFixed(4)}</small></small></small></div>
                  </Col>
                </Row>
              </Row>
            </Col>
            <Col xs={3}>
              <button className='btn default-button small-button width-86 pull-right' type="button" onClick={this.props.handleClose}>Cancel</button>
            </Col>
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
