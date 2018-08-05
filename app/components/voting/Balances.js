// @flow
import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import PayoutModal from './PayoutModal';

class Balances extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_payout_modal: false
    };
  }

  togglePayoutModal = () => {
    this.setState({ show_payout_modal: !this.state.show_payout_modal });
  }

  render() {
    return (
      <div className='voting-balances'>
        <Row>
          <Col md={12}>
            <div className="text-center">
              Staked Balance: {this.props.curationCouncil.stakedBalance}<span className="botcoin">BOTC</span>
            </div>
          </Col>
        </Row>
        <Row className="show-grid">
          <Col xs={6} md={6}>
            <Well>
              <div className="text-center">
                <h4>Reward Balance</h4>
                {this.props.voting.rewardBalance} BOTC
              </div>
            </Well>
            {(this.props.voting.rewardBalance > 0) && <Button block onClick={this.togglePayoutModal}>Payout reward</Button>}
          </Col>
          <Col xs={6} md={6}>
            <Well>
              <div className="text-center">
                <h4>Available Reward</h4>
                {this.props.voting.availableReward} BOTC
              </div>
            </Well>
          </Col>
          <PayoutModal show={this.state.show_payout_modal} handleClose={this.togglePayoutModal} {...this.props.voting} />
        </Row>
      </div>
      );
  }
}

export default Balances;
