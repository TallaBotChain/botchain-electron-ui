// @flow
import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Col } from 'react-bootstrap';
import VoteModal from './VoteModal'

export default class VoteList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      vote_to_show: null
    };
  }

  voteClick = (vote) => () => {
    this.props.resetVoteState();
    if (!this.props.developer.records[vote.address]) {
      this.props.getDeveloperInfo(vote.address);
    }
    this.setState({ vote_to_show: vote });
  }

  hideVote = () => {
    this.setState({ vote_to_show: null });
  }

  approveVote = () => {
    console.log("approving vote: ", this.state.vote_to_show);
    this.props.castVote(this.state.vote_to_show.key, true);
  }

  rejectVote = () => {
    console.log("rejecting vote: ", this.state.vote_to_show);
    this.props.castVote(this.state.vote_to_show.key, false);
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
        <VoteModal address={this.state.vote_to_show ? this.state.vote_to_show.address : null}
          handleClose={this.hideVote}
          onApprove={this.approveVote}
          onReject={this.rejectVote}
          {...this.props}/>
      </div>
    )
  }

}
