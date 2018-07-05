import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import QRCode from 'qrcode.react';

export default class ReceiveModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Receive</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
         <QRCode value={this.props.address} renderAs="svg" size={256} />
         <h3>Address</h3>
         <Well>{this.props.address}</Well>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
