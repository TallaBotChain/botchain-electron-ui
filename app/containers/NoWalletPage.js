import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class NoWalletPage extends Component {
  render() {
    return (
      <div>
        <h1>Getting started</h1>
        <ButtonToolbar>
          <Link to="/wallet/new" className="btn btn-primary">Create new wallet</Link>
          <Link to="/wallet/import" className="btn btn-primary">Import wallet</Link>
        </ButtonToolbar>
      </div>
    );
  }
}

export default NoWalletPage;
