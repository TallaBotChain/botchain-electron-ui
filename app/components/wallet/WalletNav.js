// @flow
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';


export default class WalletNav extends Component {


  render() {
    return (
      <ListGroup className="subnav-list">
        <NavLink className="list-group-item ethereum-link" exact to="/wallet/ethereum">Ethereum<span></span></NavLink>
        <NavLink className="list-group-item botcoin-link" exact to="/wallet/botcoin">Botcoin<span></span></NavLink>
      </ListGroup>
    );
  }
}
