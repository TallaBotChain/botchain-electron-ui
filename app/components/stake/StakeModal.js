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
        <Modal.Header closeButton>
          <Modal.Title>Submit Stake</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h4>Available Balance: {this.props.walletData.balance} BOTC</h4>
          <StakeForm onSubmit={this.handleSubmit} {...this.props} />
        </Modal.Body>
      </Modal>
    );
  }
}
