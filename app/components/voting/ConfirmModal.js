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
      result = <Button className="green-button big-button" onClick={this.doConfirm}>APPROVE</Button>;
    } else {
      result = <Button className="reject-button big-button" onClick={this.doConfirm}><span></span>REJECT</Button>
    }
    return result;
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName={`app-modal confirm-modal ${this.props.action}-modal`}>
        <Modal.Header>
          <Modal.Title className="text-center">CONFIRM {this.props.action == 'approve' ? "APPROVAL" : "REJECTION"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="dollar-text"><strong className='name state-text'>{this.voteName()}</strong> {this.voteDomain()}</div>
          <div><small className="gray">Gas Fee: {this.props.voting.voteTxEstGas} <small>ETH</small></small></div>
          {this.renderActionButton()}
        </Modal.Body>
        <Modal.Footer className="text-center">
          <Button onClick={this.props.handleClose} bsClass="btn default-button small-button width-86">Cancel</Button>
        </Modal.Footer>
      </Modal>
      );
  }
}
