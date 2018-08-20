import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default class ConfirmModal extends Component {

  voteDomain = () => {
    let vote = this.props.voting.voteToShow;
    try {
      let url = this.props.developer.records[vote.address] ? this.props.developer.records[vote.address].metadata.url : false;
      return url ? (new URL(url)).hostname : "--";
    }catch(ex) {
      return "--";
    }
  }

  voteName = () => {
    let vote = this.props.voting.voteToShow;
    try {
      let name = this.props.developer.records[vote.address].metadata.name;
      return name;
    }catch(ex) {
      return "--";
    }
  }

  doConfirm = () => {
    this.props.confirmMethod();
  }

  renderActionButton() {
    let result = "";
    if(this.props.action == "approve") {
      result = <Button className="green-button" onClick={this.doConfirm}>APPROVE</Button>;
    } else {
      result = <Button className="reject-button" onClick={this.doConfirm}><span></span>REJECT</Button>
    }
    return result;
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName={`app-modal confirm-modal ${this.props.action}-modal`}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">CONFIRM {this.props.action == 'approve' ? "APPROVAL" : "REJECTION"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div><b className='name'>{this.voteName()}</b> {this.voteDomain()}</div>

          <div>
            <small className="gray-text">Gas Fee: {this.props.voting.voteTxEstGas} ETH</small>
          </div>
          {this.renderActionButton()}
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button onClick={this.props.handleClose} bsSize="small">Close</Button>
        </Modal.Footer>
      </Modal>
      );
  }
}
