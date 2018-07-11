// @flow
import React, { Component } from 'react';
import { Row, Col, Well } from 'react-bootstrap'

class Balances extends Component {

  render() {
    return (
      <Row className="show-grid">
        <Col xs={6} md={6}>
          <Well>
            <div className="text-center">
              <h4>Reward Balance</h4>
              {this.props.rewardBalance} BOTC
            </div>
          </Well>
        </Col>
        <Col xs={6} md={6}>
          <Well>
            <div className="text-center">
              <h4>Available Reward</h4>
              {this.props.availableReward} BOTC
            </div>
          </Well>
        </Col>
      </Row>
    );
  }
}

export default Balances;
