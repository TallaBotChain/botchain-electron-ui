import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import SendForm from './SendForm';
import {round} from '../../utils/Rounder'

export default class SendModal extends Component {

  handleSubmit = (values) => {
    this.props.transfer(values.to, values.amount)
  }

  componentWillReceiveProps(nextProps) {
    if(!this.props.walletData.hasPendingTx && nextProps.walletData.hasPendingTx && this.props.show) {
      this.props.handleClose()
    }
  }


  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName={`app-modal send-modal ${this.props.walletData.currency.toLowerCase()}-modal`}>
        <Modal.Header>
          <Modal.Title className="text-center">Send {this.props.walletData.currency==="ETH" ? "ETHEREUM" : "BOTCOIN"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="gray-text text-center">Available Balance: <span className={this.props.walletData.currency.toLowerCase()}>{round(this.props.walletData.balance)} <small>{this.props.walletData.currency}</small></span></h3>
          <SendForm onSubmit={this.handleSubmit} {...this.props} />
        </Modal.Body>
      </Modal>
    );
  }
}
