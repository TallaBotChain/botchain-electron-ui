import React, { Component } from 'react';
import { Modal, Button, Row, Col, Well, Alert } from 'react-bootstrap';
import JsonTable from './JsonTable';

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
              <Row>
                {this.props.voting.error ? <Col xs={12}><Alert bsStyle="danger">{this.props.voting.error}</Alert></Col> : "" }
              </Row>
              {this.props.voting.voteTxId ? <Well>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.voting.voteTxId}`} target='_blank'>Click here</a>  to check the status of this transaction.</Well> : (
              <div>
                <h4>Registration Info</h4>
                <JsonTable data={this.developer().metadata} />
                <Row className="show-grid">
                  <Col xs={6}>
                    <Button block onClick={this.props.onApprove}>Approve</Button>
                  </Col>
                  <Col xs={6}>
                    <Button block onClick={this.props.onReject}>Reject</Button>
                  </Col>
                </Row>
              </div>) }
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
