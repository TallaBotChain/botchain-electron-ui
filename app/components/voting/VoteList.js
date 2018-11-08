// @flow
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';
import VoteModal from './VoteModal';
import VoteListItem from './VoteListItem';
import NoVotes from './NoVotes';

export default class VoteList extends Component {

  constructor(props) {
    super(props);
  }

  voteClick = (vote) => () => {
    if (!vote.expired && !vote.votedOnStatus) {
       this.props.castVoteEstGas(vote.key, true)
    }
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
    if( this.props.votes.length > 0 ) {
      return (
        <Col xs={this.props.voting.voteToShow ? 4 : 12} className='vote-list-container'>
          <ListGroup>
            {votes}
          </ListGroup>
        </Col>
      );
    } else return <NoVotes />;
  }

}
