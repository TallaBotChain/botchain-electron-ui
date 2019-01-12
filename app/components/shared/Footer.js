// @flow
import React, { Component } from 'react';
import { Row, Col, Well } from 'react-bootstrap';
import NetworkIndicator from './NetworkIndicator';
import {remote} from 'electron';

export default class Footer extends Component {

  render() {
    return (
      <Row className="footer">
        <Col xs={6} className="gray-text">
          <Col xs={4}>
            Version {remote.app.getVersion()}
          </Col>
          <Col xs={8}>
            <NetworkIndicator network={remote.getGlobal('config').network} />
          </Col>
        </Col>
        <Col xs={6} className="text-right">
          <Col xs={12}>
            <span className="logo"></span>
          </Col>
        </Col>
      </Row>
    );
  }
}
