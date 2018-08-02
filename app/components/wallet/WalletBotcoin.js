import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import ReceiveModal from './ReceiveModal';
import SendModal from './SendModal';
import WalletNav from './WalletNav'
import TransactionList from './TransactionList'
import KeyTools from '../../blockchain/KeyTools'

export default class WalletBotcoin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_send_modal: false,
      show_receive_modal: false
    };
  }

  toggleSendModal = () => {
    this.setState({ show_send_modal: !this.state.show_send_modal });
  }

  toggleReceiveModal = () => {
    this.setState({ show_receive_modal: !this.state.show_receive_modal });
  }

  render() {
    return (
      <div>
        <Col xs={3} sm={2} className="content-inner gray-bg left-inner">
          <WalletNav />
        </Col>
        <Col xs={9} sm={10} className="content-inner white-bg right-inner">

          <Col xs={12} className="text-center">
            <h2>Botcoin Balance</h2>
          <h1 className="botcoin">
            {this.props.walletData.balance}<span>BOTC</span>
          </h1>
          <strong className="dollar-balance gray">
              <span>$</span>{this.props.walletData.balance * this.props.walletData.usdExchangeRate}
          </strong>
            <div className="center-buttons">
              <Button onClick={this.toggleSendModal} bsClass="btn orange-button small-button width-100">SEND</Button>
              <Button onClick={this.toggleReceiveModal} bsClass="btn default-button small-button width-100">Receive</Button>
            </div>
            <Col xs={12}>
              <h5 className="gray text-left">TRANSACTION HISTORY</h5>
              <TransactionList {...this.props} />
            </Col>
          </Col>
          <ReceiveModal show={this.state.show_receive_modal} handleClose={this.toggleReceiveModal} address={KeyTools.address} />
          <SendModal show={this.state.show_send_modal} handleClose={this.toggleSendModal} {...this.props} />
        </Col>
      </div>
    )
  }
}
