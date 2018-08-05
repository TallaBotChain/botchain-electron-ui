// @flow
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';
import VoteModal from './VoteModal';
import VoteListItem from './VoteListItem';

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
        <VoteListItem key={vote.key} vote={vote} voteClick={this.voteClick} {...this.props} />
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
