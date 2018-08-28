import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import { remote } from 'electron';
import { Col, Row } from 'react-bootstrap';
import NotEnoughEth from '../wallet/NotEnoughEth'

export default class UnstakeModal extends Component {

  handleSubmit = (values) => {
    this.props.unstake(values.amount)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.curationCouncil.stakedBalance > 0 && nextProps.curationCouncil.stakedBalance == 0 && this.props.show) {
      this.props.handleClose()
    }
    if(!this.props.curationCouncil.hasPendingTx && nextProps.curationCouncil.hasPendingTx && this.props.show) {
      this.props.handleClose()
    }
  }

  hasEnoughEth = () => {
    return this.props.ethBalance > this.props.curationCouncil.leaveTxEstGas
  }

  render() {
    return (
      <Modal show={this.props.show} dialogClassName="app-modal stake-modal retrieve-modal" onHide={this.props.handleClose} >
        <Modal.Header>
          <Modal.Title className="text-center"><strong>Retrieve Stake</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h3 className="gray-text">Staked Balance: <strong className="state-text">{this.props.curationCouncil.stakedBalance}</strong> <small className="botc">BOTC</small></h3>
          <form>
            <Row>
              {!this.hasEnoughEth() && (
                <Col xs={10} xsOffset={1}>
                  <NotEnoughEth />
                </Col>
              )}
              <Col xs={10} xsOffset={1} className="text-left">
                <span className="form-icon botcoin-icon"></span>
                <div className="form-group">
                  <label className="botcoin-green">COUNCIL ADDRESS</label>
                  <input className="form-control green-input" type="text" readOnly={true} value={remote.getGlobal('config').curation_council_contract} />
                </div>
              </Col>
            </Row>
          </form>
          <p className="gray-text"><small>Retrieving your stake will return all of <br/> the stake balance to your Wallet.</small></p>
          <Button className="btn orange-button medium-button" onClick={this.props.unstake} disabled={!this.hasEnoughEth()}>RETRIEVE STAKE</Button>
          <div className="gray-text"><small><small>Gas Fee: {this.props.curationCouncil.leaveTxEstGas} <small>ETH</small></small></small></div>
        </Modal.Body>
      </Modal>
    );
  }
}
