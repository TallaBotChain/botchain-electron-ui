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

  toggleSendModal = () => {
    this.setState({ show_send_modal: !this.state.show_send_modal });
  }

  toggleReceiveModal = () => {
    this.setState({ show_receive_modal: !this.state.show_receive_modal });
  }


  render() {
    return (
      <Row className="show-grid">
        <Col xs={4} md={3} className="sub-navigation">
          <WalletNav />
        </Col>
        <Col xs={8} md={9}>
          <h1>Ethereum Wallet</h1>
          <Well>
            <div className="text-center">
              <h4>Balance</h4>
              {this.props.walletData.balance} ETH
            </div>
          </Well>
          <Row className="show-grid">
            <Col xs={6}>
              <Button block onClick={this.toggleSendModal}>Send</Button>
            </Col>
            <Col xs={6}>
              <Button block onClick={this.toggleReceiveModal}>Receive</Button>
            </Col>
          </Row>
          <h3>History</h3>
          <TransactionList {...this.props}/>
        </Col>
        <ReceiveModal show={this.state.show_receive_modal} handleClose={this.toggleReceiveModal} address={KeyTools.address} />
        <SendModal 
          show={this.state.show_send_modal} 
          handleClose={this.toggleSendModal}
          currencyName="ETH"
          {...this.props}
        />
      </Row>
    )
  }
}