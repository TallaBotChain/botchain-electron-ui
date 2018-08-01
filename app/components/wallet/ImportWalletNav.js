import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class ImportWalletNav extends Component {
  render() {
    return (
      <div className="import-wallet-nav">
        <Link to="/wallet/import" className="btn default-button small-button">Import wallet</Link>
        <p>
          You can import an existing wallet to use with the Curation Council App.<br />
          However, the wallet will only hold Botcoin and Ethereum.
        </p>
      </div>
    )
  }
}

export default ImportWalletNav;
