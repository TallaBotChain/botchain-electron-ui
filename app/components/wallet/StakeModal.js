import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import SendForm from './SendForm';

export default class StakeModal extends Component {


  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Submit Stake</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          TODO STAKE
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
