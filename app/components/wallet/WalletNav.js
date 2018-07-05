// @flow
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';


export default class WalletNav extends Component {


  render() {
    return (
      <ListGroup>
        <NavLink className="list-group-item" exact to="/wallet/ethereum">Ethereum</NavLink>
        <NavLink className="list-group-item" exact to="/wallet/botcoin">Botcoin</NavLink>
      </ListGroup> 
    );
  }
}
