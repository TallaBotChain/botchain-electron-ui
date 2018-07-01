// @flow
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ExportForm from './ExportForm';


export default class ExportModal extends Component {

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} bsSize="small">
        <Modal.Header closeButton>
          <Modal.Title>Export</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExportForm onSubmit={this.props.export} {...this.props}/>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
