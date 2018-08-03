import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import StakeForm from './StakeForm';

export default class StakeModal extends Component {

  handleSubmit = (values) => {
    this.props.stake(values.amount)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.curationCouncil.stakedBalance == 0 && nextProps.curationCouncil.stakedBalance > 0 && this.props.show) {
      this.props.handleClose()
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName="app-modal stake-modal">
        <Modal.Header closeButton>
          <Modal.Title>Submit Stake</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.props.curationCouncil.joinTxId && !this.props.curationCouncil.joinTxMined ? (
            <Well>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.curationCouncil.joinTxId}`} target='_blank'>Click here</a>  to check the status of this transaction.</Well>
          ) : (
              <div>
                {this.props.curationCouncil.joinTxMined && (
                  <Well>{this.props.curationCouncil.joinSuccess ? "Transaction successfully completed!" : "Transaction failed!"}</Well>
                )}
                <h4>Available Balance: {this.props.walletData.balance} BOTC</h4>
                <StakeForm label="Stake:" onSubmit={this.handleSubmit} {...this.props} />
              </div>
            )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
