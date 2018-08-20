import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import SendForm from './SendForm';

export default class SendModal extends Component {

  handleSubmit = (values) => {
    this.props.transfer(values.to, values.amount)
  }


  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName={`app-modal send-modal ${this.props.walletData.currency.toLowerCase()}-modal`}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">Send {this.props.walletData.currency==="ETH" ? "ETHEREUM" : "BOTCOIN"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.props.walletData.transferTxId && !this.props.walletData.transferTxMined ? (
            <Well>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.walletData.transferTxId}`} target='_blank'>Click here</a>  to check the status of this transaction.</Well>
          ) : (
              <div>
                {this.props.walletData.transferTxMined && (
                  <Well>{this.props.walletData.transferSuccess ? "Transaction successfully completed!" : "Transaction failed!"}</Well>
                )}
                <h3>Available Balance: {this.props.walletData.balance} {this.props.walletData.currency}</h3>
                <SendForm onSubmit={this.handleSubmit} {...this.props} />
              </div>
            )}
        </Modal.Body>
      </Modal>
    );
  }
}
