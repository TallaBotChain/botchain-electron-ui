import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';

export default class PayoutModal extends Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.rewardBalance > 0 && nextProps.rewardBalance == 0 && this.props.show) {
      this.props.handleClose();
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Payout reward</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.props.payoutTxId && !this.props.payoutTxMined ? (
            <Well>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.payoutTxId}`} target='_blank'>Click here</a>  to check the status of this transaction.</Well>
          ) : (
              <div>
                {this.props.payoutTxMined && (
                  <Well>{this.props.payoutSuccess ? "Transaction successfully completed!" : "Transaction failed!"}</Well>
                )}
                <h4>Reward Balance: {this.props.rewardBalance} BOTC</h4>
                <Button onClick={this.props.payout}>Collect</Button>
                <div><small>Gas Fee: {this.props.payoutTxEstGas} ETH</small></div>
              </div>
            )}
        </Modal.Body>
      </Modal>
    );
  }
}
