import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class ImportWalletNav extends Component {
  render() {
    return (
      <div>
        <ButtonToolbar>
          <Link to="/wallet/import" className="btn btn-primary">Import wallet</Link>
        </ButtonToolbar>
        <p>You can import an existing wallet to use with the Curation Council App. <br /> However, the wallet will only hold Botcoin and Ethereum.</p>
      </div>
    )
  }
}

export default ImportWalletNav;
