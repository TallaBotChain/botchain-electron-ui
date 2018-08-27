import React, { Component } from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { required, numericality } from 'redux-form-validators'
import { connect } from 'react-redux';
import { inputField } from '../form/FormFields'
import { remote } from 'electron';
import { Col, Row } from 'react-bootstrap';

class StakeForm extends Component {

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={10} xsOffset={1}>
            <span className="form-icon botcoin-icon"></span>
            <div className="form-group">
              <label className="botcoin-green">COUNCIL ADDRESS</label>
              <input className="form-control green-input" type="text" readOnly={true} value={remote.getGlobal('config').curation_council_contract} />
            </div>
          </Col>
          <Col xs={10} xsOffset={1}>
            <span className="form-icon currency-icon"></span>
            <Field name="amount" type="text" component={inputField} label={this.props.label} placeholder="Amount" label="Amount" validate={[required(), numericality({ '>': 0, '<=': this.props.walletData.balance })]} />
            <span className="currency botc">BOTC</span>
          </Col>
        </Row>
        <Row className="form-footer">
          <Col xs={12}>
            <Col xs={3}>
              <button className='btn orange-button small-button width-100' type="submit">SUBMIT</button>
            </Col>
            <Col xs={6}>
              <Row>
                <Row>
                  <Col xs={8} className="gray-text">
                    <div><small><strong>Send {this.props.amount ? this.props.amount : 0} <small>BOTC</small></strong></small></div>
                    <div><small><small>Gas Fee: {this.props.curationCouncil.joinTxEstGas} <small>ETH</small></small></small></div>
                  </Col>
                  <Col xs={4} className="gray-text right-small">
                    <div><small><small><strong>$0</strong></small></small></div>
                    <div><small><small><small>${this.props.curationCouncil.joinTxEstGas * this.props.usdExchangeRate}</small></small></small></div>
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

StakeForm = reduxForm({
  form: 'stake', // a unique name for this form,
})(StakeForm);

const selector = formValueSelector('stake') // <-- same as form name

StakeForm = connect(
  state => {
    const amount = selector(state, 'amount')
    return {
      amount
    };
  }
)(StakeForm);

export default StakeForm;
