// @flow
import React, { Component } from 'react';
import {Row, Col } from 'react-bootstrap'
export default class Wallet extends Component {

  render() {
    return (
      <Row className="show-grid">
      <Col xs={12}><h1>Wallet</h1></Col>
        <Col xs={4} md={3}>
          <h1>Submenu</h1>
        </Col>
        <Col xs={8} md={9}>
        <h1>Content</h1>
        </Col>
      </Row>
    );
  }
}