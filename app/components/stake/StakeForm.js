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
        <Field name="address" type="text" readOnly={true} component={inputField} label="Council Address" placeholder={remote.getGlobal('config').curation_council_contract} />
        <Field name="amount" type="text" component={inputField} placeholder="Amount" label="Amount" validate={[required(), numericality({ '>': 0, '<=': this.props.walletData.balance })]} />
        <Row>
          <Col xs={12}>
            <Row>
              <Col xs={2}><button className='btn btn-primary' type="submit">Submit</button></Col>
              <Col xs={8}>
                <Row>
                  <Col xs={6}>
                    <div><small>Stake {this.props.amount ? this.props.amount : 0} BOTC</small></div>
                    <div><small>Gas Fee: {this.props.curationCouncil.joinTxEstGas} ETH</small></div>
                  </Col>
                  <Col xs={6}>
                    <div><small>$0</small></div>
                      <div><small>${this.props.curationCouncil.joinTxEstGas * this.props.usdExchangeRate}</small></div>
                  </Col>
                </Row>
              </Col>
              <Col xs={2}><button className='btn btn-default' type="button" onClick={this.props.handleClose}>Cancel</button></Col>
            </Row>
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
