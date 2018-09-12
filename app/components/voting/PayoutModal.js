import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import NotEnoughEth from '../wallet/NotEnoughEth'
import {round} from '../../utils/Rounder'

export default class PayoutModal extends Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.voting.rewardBalance > 0 && nextProps.voting.rewardBalance == 0 && this.props.show) {
      this.props.handleClose();
    }
  }

  hasEnoughEth = () => {
    return this.props.ethBalance > this.props.voting.payoutTxEstGas
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName="app-modal confirm-modal approve-modal">
        <Modal.Header>
          <Modal.Title className="text-center">Payout reward</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.props.voting.payoutTxId && !this.props.voting.payoutTxMined ? (
            <div className="pending">
              <h4>Transaction successfully submitted</h4>
              <p><em>Awaiting confirmation</em></p>
              <small>
                <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.voting.payoutTxId}`} target='_blank' className="gray-text">View transaction status on Etherscan</a>
              </small>
            </div>
          ) : (
              <div>
                {this.props.voting.payoutTxMined && (
                  <Well>{this.props.voting.payoutSuccess ? "Transaction successfully completed!" : "Transaction failed!"}</Well>
                )}
                <h4 className="state-text">Reward Balance: <span className="botcoin-green">{round(this.props.voting.rewardBalance)}</span> <span className="botcoin-title">BOTC</span></h4>
                {!this.hasEnoughEth() && (
                  <div>
                    <NotEnoughEth />
                  </div>
                )}
                <Button onClick={this.props.payout} bsClass="btn green-button big-button" disabled={!this.hasEnoughEth()}>COLLECT</Button>
                <div><small className="gray">Gas Fee: {round(this.props.voting.payoutTxEstGas)} ETH</small></div>
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose} bsClass="btn default-button small-button width-86">Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
