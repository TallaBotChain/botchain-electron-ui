import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import ReceiveModal from './ReceiveModal';
import SendModal from './SendModal';
import TransactionList from './TransactionList'
import WalletNav from './WalletNav'
import KeyTools from '../../blockchain/KeyTools'

export default class WalletEthereum extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_send_modal: false,
      show_receive_modal: false
    };
  }

  showSendModal = () => {
    this.setState({ show_send_modal: true });
    this.props.transferEstGas(KeyTools.address, "0")
  }

  hideSendModal = () => {
    this.setState({ show_send_modal: false });
  }

  showReceiveModal = () => {
    this.setState({ show_receive_modal: true });
  }

  hideReceiveModal = () => {
    this.setState({ show_receive_modal: false });
  }

  transactionList = () => {
    let list = this.props.history.ethereum.map((hash) => this.props.history.transactions[hash] )
    return list
  }

  render() {
    return (
      <div>
        <Col xs={3} sm={2} className="content-inner gray-bg left-inner">
          <WalletNav />
        </Col>
        <Col xs={9} sm={10} className="content-inner white-bg right-inner">

          <Col xs={12} className="text-center">
            <h2>Ethereum Balance</h2>
            <h1 className="ethereum">
              {this.props.walletData.balance}<span>ETH</span>
            </h1>
            <strong className="dollar-balance gray">
              <span>$</span>{(this.props.walletData.balance * this.props.usdExchangeRate).toFixed(2)}
            </strong>
            <div className="center-buttons">
              <Button onClick={this.showSendModal} bsClass="btn orange-button small-button width-100" disabled={this.props.walletData.hasPendingTx}>
                {this.props.walletData.hasPendingTx ? "IN PROGRESS" : "SEND"}
              </Button>
              <Button onClick={this.showReceiveModal} bsClass="btn default-button small-button width-100">Receive</Button>
            </div>
            <Col xs={12}>
              <h5 className="gray text-left">TRANSACTION HISTORY</h5>
              <TransactionList transactions={this.transactionList()}
                currency={this.props.walletData.currency}
                usdExchangeRate={this.props.usdExchangeRate}
              />
            </Col>
          </Col>
          <ReceiveModal show={this.state.show_receive_modal} handleClose={this.hideReceiveModal} address={KeyTools.address} currency="ethereum" />
          <SendModal
            show={this.state.show_send_modal}
            handleClose={this.hideSendModal}
            {...this.props}
          />
        </Col>
      </div>
    )
  }
}
