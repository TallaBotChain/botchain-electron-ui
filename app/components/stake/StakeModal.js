import React, { Component } from 'react';
import { Modal, Button, Alert, Well, Col, Row } from 'react-bootstrap';
import StakeForm from './StakeForm';

export default class StakeModal extends Component {

  handleSubmit = (values) => {
    this.props.stake(values.amount)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.curationCouncil.stakedBalance == 0 && nextProps.curationCouncil.stakedBalance > 0 && this.props.show) {
      this.props.handleClose()
    }
    if(!this.props.curationCouncil.hasPendingTx && nextProps.curationCouncil.hasPendingTx && this.props.show) {
      this.props.handleClose()
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName="app-modal stake-modal">
        <Modal.Header>
          <Modal.Title className="text-center"><strong>Submit Stake</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="gray-text text-center">Available Balance: <span className="botc">{this.props.walletData.balance}</span> <small className="botc">BOTC</small></h3>
          <StakeForm onSubmit={this.handleSubmit} {...this.props} />
        </Modal.Body>
      </Modal>
    );
  }
}
