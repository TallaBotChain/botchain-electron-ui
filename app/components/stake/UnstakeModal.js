import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import { remote } from 'electron';

export default class UnstakeModal extends Component {

  handleSubmit = (values) => {
    this.props.unstake(values.amount)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.curationCouncil.stakedBalance > 0 && nextProps.curationCouncil.stakedBalance == 0 && this.props.show) {
      this.props.handleClose()
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Retreive Stake</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.props.curationCouncil.leaveTxId && !this.props.curationCouncil.leaveTxMined ? (
            <Well>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.curationCouncil.leaveTxId}`} target='_blank'>Click here</a>  to check the status of this transaction.</Well>
          ) : (
              <div>
                {this.props.curationCouncil.leaveTxMined && (
                  <Well>{this.props.curationCouncil.leaveSuccess ? "Transaction successfully completed!" : "Transaction failed!"}</Well>
                )}
                <h4>Staked Balance: {this.props.curationCouncil.stakedBalance} BOTC</h4>
                <form>
                  <label>Curation Council</label>
                  <input type="text" readOnly={true} placeholder={remote.getGlobal('config').curation_council_contract} />
                </form>
                <p>Retrieving your stake will return all of <br/> the stake balance to your Wallet.</p>
                <Button onClick={this.props.unstake}>Unstake</Button>
                <div><small>Gas Fee: {this.props.curationCouncil.leaveTxEstGas} ETH</small></div>
              </div>
            )}
        </Modal.Body>
      </Modal>
    );
  }
}
