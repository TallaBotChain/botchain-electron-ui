import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import StakeModal from '../stake/StakeModal';
import UnstakeModal from './UnstakeModal';
import TransactionList from '../wallet/TransactionList'
import KeyTools from '../../blockchain/KeyTools'
import CurationCouncil from '../../blockchain/CurationCouncil';
import {round} from '../../utils/Rounder'

export default class Stake extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_stake_modal: false,
      show_unstake_modal: false
    };
  }

  showStakeModal = () => {
    this.setState({ show_stake_modal: true });
    this.props.stakeEstGas("0")
  }

  hideStakeModal = () => {
    this.setState({ show_stake_modal: false });
  }

  showUnstakeModal = () => {
    this.props.unstakeEstGas()
    this.setState({ show_unstake_modal: true });
  }

  hideUnstakeModal = () => {
    this.setState({ show_unstake_modal: false });
  }

  transactionList = () => {
    let list = this.props.history.stake.map((hash) => this.props.history.transactions[hash] )
    return list
  }


  render() {
    return (
      <Col xs={12} className="content-inner no-right-padding no-top-padding white-bg">
        <Col xs={12} className="content-inner not-cover-footer extra-right-padding text-center">
          <h2>Staked Balance</h2>
          <h1 className={this.props.curationCouncil.stakedBalance > 0 ? "state-text" : "gray"}>
            {round(this.props.curationCouncil.stakedBalance)}<span className="botcoin">BOT</span>
          </h1>
          {this.props.curationCouncil.stakedBalance > 0 ? (
            <div>
              <div className="center-button">
              <Button className="btn orange-button small-button" onClick={this.showUnstakeModal} disabled={this.props.curationCouncil.hasPendingTx}>
                {this.props.curationCouncil.hasPendingTx ? "IN PROGRESS" : "UNSTAKE"}
              </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="center-button">
                <Button className="btn orange-button small-button" onClick={this.showStakeModal} disabled={this.props.curationCouncil.hasPendingTx}>
                  {this.props.curationCouncil.hasPendingTx ? "IN PROGRESS" : "STAKE"}
                </Button>
              </div>
              <Col md={8} sm={8} xs={12} componentClass="h3" className="text-left">
In order to participate in Curation Council voting, you must first stake a fixed amount of Botcoin. Your stake can be any amount greater than {this.props.curationCouncil.minStake} BOT.
              </Col>
          </div>
          )}
          <Col xs={12}>
            <h5 className="gray text-left">TRANSACTION HISTORY</h5>
            <TransactionList transactions={this.transactionList()}
              currency={this.props.walletData.currency}
              usdExchangeRate={this.props.usdExchangeRate}
            />
          </Col>
        </Col>
        <StakeModal show={this.state.show_stake_modal} handleClose={this.hideStakeModal} {...this.props} />
        <UnstakeModal show={this.state.show_unstake_modal} handleClose={this.hideUnstakeModal} {...this.props} />
      </Col>
    )
  }
}
