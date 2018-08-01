import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import StakeModal from '../stake/StakeModal';
import UnstakeModal from './UnstakeModal';
import TransactionList from '../wallet/TransactionList'
import KeyTools from '../../blockchain/KeyTools'

export default class Stake extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_stake_modal: false,
      show_unstake_modal: false
    };
  }

  toggleStakeModal = () => {
    this.setState({ show_stake_modal: !this.state.show_stake_modal });
  }

  toggleUnstakeModal = () => {
    this.setState({ show_unstake_modal: !this.state.show_unstake_modal });
  }


  render() {
    return (
      <Col xs={12} className="content-inner white-bg">

        <Col xs={12} className="text-center">
          <h2>Staked Balance</h2>
          <h1 className="ethereum">
            {this.props.curationCouncil.stakedBalance} <span>BOTC</span>
          </h1>
          <strong className="dollar-balance gray">
            <span>$</span>588.14
          </strong>
          {this.props.curationCouncil.stakedBalance > 0 ? (
            <div>
              <div className="center-buttons">
              <Button onClick={this.toggleUnstakeModal}>Unstake</Button>
              </div>
            </div>
          ) : (
              <div>
                <div className="center-buttons">
                <Button onClick={this.toggleStakeModal}>Stake</Button>
                </div>
                <h4>In order to participate in Curation Council voting you must first stake a fixed amount of Botcoin.</h4>
                <p>Your stake can be any amount greater than zero. However, the greater the stake the more you'll be able to vote. To read more about staking and voting, please refer to <a href="#">this article</a></p>
              </div>
            )}
          <Col xs={12}>
            <h5 className="gray text-left">TRANSACTION HISTORY</h5>
            <TransactionList {...this.props} />
          </Col>
        </Col>
        <StakeModal show={this.state.show_stake_modal} handleClose={this.toggleStakeModal} {...this.props} />
        <UnstakeModal show={this.state.show_unstake_modal} handleClose={this.toggleUnstakeModal} {...this.props} />
      </Col>
    )
  }
}