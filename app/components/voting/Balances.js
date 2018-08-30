// @flow
import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap'
import PayoutModal from './PayoutModal';

class Balances extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_payout_modal: false
    };
  }

  showPayoutModal = () => {
    this.setState({ show_payout_modal: true });
    this.props.payoutEstGas()
  }

  hidePayoutModal = () => {
    this.setState({ show_payout_modal: false });
  }

  render() {
    return (
      <div className='voting-balances'>
        <Row>
          <Col xs={12} className="white-header text-center">
            <p className="gray-text">
              <small>Staked Balance:</small> {this.props.curationCouncil.stakedBalance} <span>BOTC</span>
            </p>
          </Col>
        </Row>
        <Row className="text-center">
          <Col xs={6} className="gray-border">
            <h2 className="state-text">Your Reward Balance</h2>
            <h1 className="botcoin-green">{this.props.voting.rewardBalance}<span className="botcoin-title">BOTC</span></h1>
          {(this.props.voting.rewardBalance > 0) && <Button onClick={this.showPayoutModal} bsClass="btn default-button small-button">Payout Reward</Button>}
          </Col>
          <Col xs={6} className="gray-border">
            <h2 className="state-text">Available Reward</h2>
            <h1 className="botcoin-green">{this.props.voting.availableReward}<span className="botcoin-title">BOTC</span></h1>
          </Col>
          <PayoutModal show={this.state.show_payout_modal} handleClose={this.hidePayoutModal} {...this.props} />
        </Row>
      </div>
      );
  }
}

export default Balances;
