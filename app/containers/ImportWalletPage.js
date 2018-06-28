import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ImportWalletPage extends Component {
  render() {
    return (
      <div>
        <h1>Import wallet</h1>
        <ButtonToolbar>
          <Link to="/wallet/import/mnemonic"
            className="btn btn-primary">
            Import passphrase
          </Link>
          <Link to="/wallet/import/private_key"
            className="btn btn-primary">
            Import private key
          </Link>
        </ButtonToolbar>
      </div>
    );
  }
}

export default ImportWalletPage;
