// @flow
import React, { Component } from 'react';
import { Col } from 'react-bootstrap'
import Balances from './Balances';
import VoteList from './VoteList';
import VoteDetails from './VoteDetails';

class Voting extends Component {

  render() {
    return (
      <div className={this.props.voting.voteToShow ? "voting-with-details" : ""}>
        <Balances {...this.props} />
        <a href='#' className='voting-return-button' onClick={this.props.hideVote} >Cancel and return to main view</a>
        {this.props.voting.inProgress ? (
          <div className='text-center'>Loading...</div>
        ) : (
          <div className='vote-list-details-wrap clearfix'>
            <VoteList votes={this.props.voting.votes} {...this.props} />
            <VoteDetails {...this.props} />
          </div>
        )}
      </div>);
  }
}

export default Voting;
