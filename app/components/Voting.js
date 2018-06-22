// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';


export default class Voting extends Component {

  render() {
    return (
      <div>
        <h1>Home</h1>
        <Alert bsStyle="warning">
          <strong>Hey!</strong> Alert test.
          </Alert>
      </div>
    );
  }
}
