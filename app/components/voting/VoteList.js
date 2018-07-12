// @flow
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';

export default class VoteList extends Component {

  voteClick = (vote) => () => {
    alert(`Clicked vote: ${vote.name}`);
  }

  render() {
    const votes = this.props.votes.map((vote) =>
      <ListGroupItem key={vote.key} title={vote.address} className='clearfix' onClick={this.voteClick(vote)}>
        <Col xs={6} md={9}>{vote.name}</Col>
        <Col xs={6} md={3}>Reward {vote.reward}</Col>
      </ListGroupItem>
      );
    return (
      <div className='vote-list-container'>
        <ListGroup>
          {votes}
        </ListGroup>
      </div>
    )
  }

}
