// @flow
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';


export default class AppNav extends Component {


  render() {
    return (
      <ListGroup className="nav-list">
        <NavLink className="list-group-item voting text-center" exact to="/">
          <span className="center-block"></span>
          Voting
        </NavLink>
        <NavLink className="list-group-item stake text-center" to="/stake">
          <span className="center-block"></span>
          Stake
        </NavLink>
        <NavLink className="list-group-item wallet text-center" to="/wallet">
          <span className="center-block"></span>
          Wallet
        </NavLink>
        <NavLink className="list-group-item settings text-center" to="/settings">
          <span className="center-block"></span>
          Settings
        </NavLink>
      </ListGroup>
    );
  }
}
