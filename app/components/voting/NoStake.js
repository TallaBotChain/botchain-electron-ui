// @flow
import React, { Component } from 'react';
import { Col, Row, Button } from 'react-bootstrap'
import PayoutModal from './PayoutModal';
import { Link } from 'react-router-dom';

class NoStake extends Component {

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} className="white-header text-center">
            <p className="gray-text">
              <small>Staked Balance:</small> 0.000 <span>BOT</span>
            </p>
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="gray-body">
            <Col xs={12}>
              <Col md={9} sm={10} xs={12}>
                <h3 className="state-text">Participating in Curation Council voting requires a stake.</h3>
                <p className="gray-p">
                  Your stake can be any amount greater than {this.props.curationCouncil.minStake} BOT. Click the button below to go directly to the Stake screen to submit your first stake.
                </p>
                <Link to="/stake" className="btn orange-button small-button">SUBMIT STAKE</Link>
              </Col>
            </Col>
          </Col>
        </Row>
      </div>
      );
  }
}

export default NoStake;
