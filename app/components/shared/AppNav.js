// @flow
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';


export default class AppNav extends Component {


  render() {
    return (
      <ListGroup>
        <NavLink className="list-group-item" exact to="/">Voting</NavLink>
        <NavLink className="list-group-item" to="/wallet">Wallet</NavLink>
        <NavLink className="list-group-item" to="/settings">Settings</NavLink>
      </ListGroup> 
    );
  }
}
