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
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName="app-modal approve-modal">
        <Modal.Header>
          <Modal.Title className="text-center">Payout reward</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.props.payoutTxId && !this.props.payoutTxMined ? (
            <Well>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.payoutTxId}`} target='_blank'>Click here</a>  to check the status of this transaction.</Well>
          ) : (
              <div>
                {this.props.payoutTxMined && (
                  <Well>{this.props.payoutSuccess ? "Transaction successfully completed!" : "Transaction failed!"}</Well>
                )}
                <h4 className="state-text">Reward Balance: <span className="botcoin-green">{this.props.rewardBalance}</span> <span className="botcoin-title">BOTC</span></h4>
              <Button onClick={this.props.payout} bsClass="btn green-button big-button">COLLECT</Button>
              <div><small className="gray">Gas Fee: {this.props.payoutTxEstGas} ETH</small></div>
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose} bsClass="btn default-button small-button width-100">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
