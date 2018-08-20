// @flow
import React, { Component } from 'react';
import { Row, Col, Well } from 'react-bootstrap'

export default class Footer extends Component {

  render() {
    return (
      <Row className="footer">
        <Col xs={6} className="gray-text">
          <Col xs={12}>
            Version 1.0.2
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
