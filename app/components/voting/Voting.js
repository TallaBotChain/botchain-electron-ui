// @flow
import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap'
import Balances from './Balances';
import VoteList from './VoteList';
import VoteDetails from './VoteDetails';

class Voting extends Component {

  render() {
    return (
      <div className= {this.props.voting.voteToShow ? "voting voting-with-details" : "voting"}>
        <Balances {...this.props} />
        <Row>
          <Col xs={12} className="gray-body">
            <Col xs={12}>
              <Col xs={12}>
                <a href='#' className='voting-return-button gray' onClick={this.props.hideVote} >Cancel and return to main view</a>
              </Col>
            </Col>
            <Col xs={12} className='vote-list-details-wrap clearfix'>
              <VoteList votes={this.props.voting.votes} {...this.props} />
              <VoteDetails {...this.props} />
            </Col>
            {this.props.voting.inProgress ? (
            <div className='center-block loading'></div>
            ) : ("")}
          </Col>
        </Row>
      </div>);
  }
}

export default Voting;
