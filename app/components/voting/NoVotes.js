// @flow
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class NoVotes extends Component {

  render() {
    return (
      <Alert bsStyle='info'>
        There are currently no new registrations that require your vote. As soon as there is a new registration you would see it here.
      </Alert>
      );
  }

}

export default NoVotes;
