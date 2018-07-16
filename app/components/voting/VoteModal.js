import React, { Component } from 'react';
import { Modal, Button, Row, Col, Well } from 'react-bootstrap';

export default class VoteModal extends Component {

  developer = () => {
    return this.props.developer.records[this.props.address]
  }

  render() {
    return (
      <Modal show={this.props.address != null} onHide={this.props.handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Vote</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {this.developer() ? (
            <div>
              <Row className="show-grid">
                <Col xs={4}>URL</Col>
                <Col xs={8}>
                  {this.developer().url}
                </Col>
              </Row>
              <h4>Registration Info</h4>
              <pre>{JSON.stringify(this.developer().metadata, null, 2)}</pre>
              <Row className="show-grid">
                <Col xs={6}>
                  <Button block>Approve</Button>
                </Col>
                <Col xs={6}>
                  <Button block>Reject</Button>
                </Col>
              </Row>
            </div>
          ) : (
              <div>
                {this.props.developer.inProgress ? <Well>Fetching vote details</Well> : <Well>{this.props.developer.error}</Well>}
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
