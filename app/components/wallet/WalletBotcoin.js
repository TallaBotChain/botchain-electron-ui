import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import ReceiveModal from './ReceiveModal';
import SendModal from './SendModal';
import StakeModal from './StakeModal';
import UnstakeModal from './UnstakeModal';
import TransactionList from './TransactionList'
import WalletNav from './WalletNav'
import KeyTools from '../../blockchain/KeyTools'

export default class WalletBotcoin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_send_modal: false,
      show_receive_modal: false,
      show_stake_modal: false,
      show_unstake_modal: false
    };
  }

  toggleSendModal = () => {
    this.setState({ show_send_modal: !this.state.show_send_modal });
  }

  toggleReceiveModal = () => {
    this.setState({ show_receive_modal: !this.state.show_receive_modal });
  }

  toggleStakeModal = () => {
    this.setState({ show_stake_modal: !this.state.show_stake_modal });
  }

  toggleUnstakeModal = () => {
    this.setState({ show_unstake_modal: !this.state.show_unstake_modal });
  }


  render() {
    return (
      <Row className="show-grid">
        <Col xs={4} md={3} className="sub-navigation">
          <WalletNav />
        </Col>
        <Col xs={8} md={9}>
          <h1>BotCoin Wallet</h1>
          <Row className="show-grid">
            <Col xs={6}>
              <Well>
                <div className="text-center">
                  <h4>Staked Balance</h4>
                  {this.props.curationCouncil.stakedBalance} BOTC
            </div>
              </Well>
            </Col>
            <Col xs={6}>
              <Well>
                <div className="text-center">
                  <h4>Available Balance</h4>
                  {this.props.walletData.balance} BOTC
            </div>
              </Well>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={3}>
              <Button block onClick={this.toggleSendModal}>Send</Button>
            </Col>
            <Col xs={3}>
              <Button block onClick={this.toggleReceiveModal}>Receive</Button>
            </Col>
            <Col xs={3}>
              <Button block disabled={this.props.curationCouncil.stakedBalance > 0} onClick={this.toggleStakeModal}>Stake</Button>
            </Col>
            <Col xs={3}>
              <Button block disabled={this.props.curationCouncil.stakedBalance == 0} onClick={this.toggleUnstakeModal}>Unstake</Button>
            </Col>
          </Row>
          <h3>History</h3>
          <TransactionList {...this.props} />
        </Col>
        <ReceiveModal show={this.state.show_receive_modal} handleClose={this.toggleReceiveModal} address={KeyTools.address} />
        <SendModal 
          show={this.state.show_send_modal} 
          handleClose={this.toggleSendModal}
          {...this.props}
        />
        <StakeModal show={this.state.show_stake_modal} handleClose={this.toggleStakeModal} {...this.props} />
        <UnstakeModal show={this.state.show_unstake_modal} handleClose={this.toggleUnstakeModal} {...this.props} />
      </Row>
    )
  }
}