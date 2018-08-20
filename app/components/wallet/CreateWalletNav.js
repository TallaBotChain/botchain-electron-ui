import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class CreateWalletNav extends Component {
  render() {
    return (
      <div>
        <Link to="/registration" className="btn default-button small-button">Create New Wallet</Link>
        <p>Create a new wallet to use with the Curation Council App. <br /> The wallet will hold Botcoin and Ethereum.</p>
      </div>
    )
  }
}

export default CreateWalletNav;
