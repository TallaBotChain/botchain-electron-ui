import React, { Component } from 'react';
import { ButtonToolbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class CreateWalletNav extends Component {
  render() {
    return (
      <div>
        <ButtonToolbar>
          <Link to="/registration" className="btn btn-primary">Create New Wallet</Link>
        </ButtonToolbar>
        <p>Create a new wallet to use with the Curation Council App. <br /> The wallet will hold Botcoin and Ethereum.</p>
      </div>
    )
  }
}

export default CreateWalletNav;
