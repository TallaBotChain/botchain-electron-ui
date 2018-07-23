// @flow
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';
import VoteModal from './VoteModal'

export default class VoteList extends Component {

  constructor(props) {
    super(props);
  }

  voteClick = (vote) => () => {
    this.props.resetVoteState();
    if (!this.props.developer.records[vote.address]) {
      this.props.getDeveloperInfo(vote.address);
    }
    this.props.showVote(vote);
  }

  hideVote = () => {
    this.props.hideVote();
  }

  approveVote = () => {
    this.props.castVote(this.props.voting.voteToShow.key, true);
  }

  rejectVote = () => {
    this.props.castVote(this.props.voting.voteToShow.key, false);
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
        <VoteModal address={this.props.voting.voteToShow ? this.props.voting.voteToShow.address : null}
          handleClose={this.hideVote}
          onApprove={this.approveVote}
          onReject={this.rejectVote}
          {...this.props}/>
      </div>
    )
  }

}
